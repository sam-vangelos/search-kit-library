-- Add evaluation_prompt column to search_kits
-- Stores hand-crafted evaluation prompts per kit (optional)

ALTER TABLE search_kits ADD COLUMN evaluation_prompt TEXT;

-- Add comment for documentation
COMMENT ON COLUMN search_kits.evaluation_prompt IS 'Optional hand-crafted evaluation prompt for candidate screening. When present, used instead of auto-generated prompt.';
