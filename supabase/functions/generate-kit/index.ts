import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';
import { SYSTEM_PROMPT, buildUserMessage } from './prompt.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateRequest {
  role_title: string;
  created_by: string;
  hiring_manager?: string;
  organization?: string;
  input_jd: string;
  input_intake?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { role_title, created_by, hiring_manager, organization, input_jd, input_intake }: GenerateRequest = await req.json();

    // Validate required fields
    if (!role_title || !input_jd || !created_by) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: role_title, input_jd, created_by' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get API keys from environment
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!anthropicApiKey) {
      return new Response(
        JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: 'Supabase not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build the user message (JD + intake)
    const userMessage = buildUserMessage(input_jd, input_intake);

    // Call Claude API with prompt caching for the system prompt
    console.log('Calling Claude API with prompt caching...');
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicApiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'prompt-caching-2024-07-31',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5-20251101',
        max_tokens: 16000,
        system: [
          {
            type: 'text',
            text: SYSTEM_PROMPT,
            cache_control: { type: 'ephemeral' },
          },
        ],
        messages: [
          {
            role: 'user',
            content: userMessage,
          },
        ],
      }),
    });

    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text();
      console.error('Claude API error:', errorText);
      return new Response(
        JSON.stringify({ error: 'Claude API error', details: errorText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const claudeData = await claudeResponse.json();
    const generatedText = claudeData.content[0]?.text;

    if (!generatedText) {
      return new Response(
        JSON.stringify({ error: 'No response from Claude' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the JSON response
    let kitData;
    try {
      // Clean up the response - remove markdown code fences if present
      let cleanedText = generatedText
        .replace(/^```json\s*/gim, '')
        .replace(/^```\s*/gim, '')
        .replace(/\s*```\s*$/gim, '')
        .trim();

      // If it doesn't start with {, try to find the JSON object
      if (!cleanedText.startsWith('{')) {
        const startIndex = cleanedText.indexOf('{');
        if (startIndex === -1) {
          throw new Error('No JSON object found in response');
        }
        cleanedText = cleanedText.substring(startIndex);
      }

      // Find the matching closing brace (handles nested braces correctly)
      let braceCount = 0;
      let inString = false;
      let escape = false;
      let endIndex = -1;

      for (let i = 0; i < cleanedText.length; i++) {
        const char = cleanedText[i];

        if (escape) {
          escape = false;
          continue;
        }

        if (char === '\\' && inString) {
          escape = true;
          continue;
        }

        if (char === '"' && !escape) {
          inString = !inString;
          continue;
        }

        if (!inString) {
          if (char === '{') braceCount++;
          if (char === '}') braceCount--;
          if (braceCount === 0) {
            endIndex = i + 1;
            break;
          }
        }
      }

      if (endIndex === -1) {
        throw new Error('Unbalanced braces in JSON response');
      }

      const jsonString = cleanedText.substring(0, endIndex);

      // Try to parse, with detailed error on failure
      try {
        kitData = JSON.parse(jsonString);
      } catch (innerParseError) {
        // Try to identify the exact position of the error
        const errorMatch = innerParseError.message.match(/position (\d+)/);
        if (errorMatch) {
          const pos = parseInt(errorMatch[1]);
          const context = jsonString.substring(Math.max(0, pos - 100), pos + 100);
          throw new Error(`JSON syntax error near position ${pos}: ...${context}...`);
        }
        throw innerParseError;
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Raw response length:', generatedText.length);
      console.error('Raw response start:', generatedText.substring(0, 500));
      console.error('Raw response end:', generatedText.substring(generatedText.length - 500));
      return new Response(
        JSON.stringify({
          error: 'Failed to parse Claude response as JSON',
          parse_error: parseError.message,
          response_length: generatedText.length,
          raw_start: generatedText.substring(0, 1000),
          raw_end: generatedText.substring(generatedText.length - 1000)
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate the structure
    if (!kitData.blocks || !Array.isArray(kitData.blocks)) {
      return new Response(
        JSON.stringify({ error: 'Invalid kit structure: missing blocks array' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Store in Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: insertedKit, error: insertError } = await supabase
      .from('search_kits')
      .insert({
        role_title,
        company: organization || null, // organization maps to company column
        created_by,
        input_jd,
        input_intake: input_intake || null,
        kit_data: kitData,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to save kit', details: insertError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Return the created kit
    return new Response(
      JSON.stringify({
        success: true,
        kit: insertedKit,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Unexpected error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
