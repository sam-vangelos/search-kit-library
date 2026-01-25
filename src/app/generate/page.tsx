'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type GenerationStatus = 'idle' | 'generating' | 'success' | 'error';

export default function GeneratePage() {
  const router = useRouter();
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [generatedKitId, setGeneratedKitId] = useState<string | null>(null);

  // Form fields
  const [roleTitle, setRoleTitle] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [hiringManager, setHiringManager] = useState('');
  const [organization, setOrganization] = useState('');
  const [inputJd, setInputJd] = useState('');
  const [inputIntake, setInputIntake] = useState('');

  const orgOptions = [
    { value: '', label: 'Select organization...' },
    { value: 'TA2', label: 'TA2' },
    { value: 'TI', label: 'TI' },
    { value: 'Finance', label: 'Finance' },
    { value: 'People', label: 'People' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Delivery', label: 'Delivery' },
    { value: 'Fulfillment', label: 'Fulfillment' },
    { value: 'Legal', label: 'Legal' },
    { value: 'R&D', label: 'R&D' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('generating');
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/generate-kit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            role_title: roleTitle,
            created_by: createdBy,
            hiring_manager: hiringManager || undefined,
            organization: organization || undefined,
            input_jd: inputJd,
            input_intake: inputIntake || undefined,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate kit');
      }

      setStatus('success');
      setGeneratedKitId(data.kit.id);

      // Redirect to the new kit after a short delay
      setTimeout(() => {
        router.push(`/kit/${data.kit.id}`);
      }, 1500);

    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    }
  };

  const isFormValid = roleTitle.trim() && createdBy.trim() && inputJd.trim().length >= 100;

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="border-b border-border-primary">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-lg font-bold text-text-primary">Generate Search Kit</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-8">
        {status === 'generating' ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-6 relative">
              <div className="absolute inset-0 border-4 border-border-primary rounded-full"></div>
              <div className="absolute inset-0 border-4 border-accent-blue rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              Generating Search Kit...
            </h2>
            <p className="text-text-secondary mb-2">
              Claude is analyzing the job description and building your boolean library.
            </p>
            <p className="text-sm text-text-muted">
              This typically takes 30-60 seconds.
            </p>
          </div>
        ) : status === 'success' ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-6 bg-accent-green/15 border border-accent-green rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-3">
              Search Kit Generated!
            </h2>
            <p className="text-text-secondary mb-4">
              Redirecting you to your new kit...
            </p>
            <Link
              href={`/kit/${generatedKitId}`}
              className="text-accent-blue hover:underline"
            >
              Click here if not redirected
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error message */}
            {status === 'error' && error && (
              <div className="bg-accent-red/10 border border-accent-red/30 rounded-md p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-accent-red mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-accent-red">Generation Failed</h3>
                    <p className="text-sm text-text-secondary mt-1">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Role Title */}
            <div>
              <label htmlFor="roleTitle" className="block text-sm font-semibold text-text-primary mb-2">
                Role Title <span className="text-accent-red">*</span>
              </label>
              <input
                type="text"
                id="roleTitle"
                value={roleTitle}
                onChange={(e) => setRoleTitle(e.target.value)}
                placeholder="e.g., Frontier Data Lead – RL"
                className="search-input w-full px-4 py-3 rounded-md text-sm focus:outline-none"
                required
              />
            </div>

            {/* Your Name */}
            <div>
              <label htmlFor="createdBy" className="block text-sm font-semibold text-text-primary mb-2">
                Your Name <span className="text-accent-red">*</span>
              </label>
              <input
                type="text"
                id="createdBy"
                value={createdBy}
                onChange={(e) => setCreatedBy(e.target.value)}
                placeholder="e.g., Sam Vangelos"
                className="search-input w-full px-4 py-3 rounded-md text-sm focus:outline-none"
                required
              />
            </div>

            {/* Hiring Manager */}
            <div>
              <label htmlFor="hiringManager" className="block text-sm font-semibold text-text-primary mb-2">
                Hiring Manager
              </label>
              <input
                type="text"
                id="hiringManager"
                value={hiringManager}
                onChange={(e) => setHiringManager(e.target.value)}
                placeholder="e.g., John Smith"
                className="search-input w-full px-4 py-3 rounded-md text-sm focus:outline-none"
              />
            </div>

            {/* Organization */}
            <div>
              <label htmlFor="organization" className="block text-sm font-semibold text-text-primary mb-2">
                Organization
              </label>
              <div className="relative">
                <select
                  id="organization"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="search-input w-full px-4 py-3 pr-10 rounded-md text-sm focus:outline-none appearance-none bg-bg-secondary cursor-pointer"
                >
                  {orgOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Job Description */}
            <div>
              <label htmlFor="inputJd" className="block text-sm font-semibold text-text-primary mb-2">
                Job Description <span className="text-accent-red">*</span>
              </label>
              <p className="text-xs text-text-muted mb-2">
                Paste the full job description. The more detail, the better the search kit.
              </p>
              <textarea
                id="inputJd"
                value={inputJd}
                onChange={(e) => setInputJd(e.target.value)}
                placeholder="Paste the full job description here..."
                rows={12}
                className="search-input w-full px-4 py-3 rounded-md text-sm focus:outline-none resize-y min-h-[200px]"
                required
              />
              <p className="text-xs text-text-muted mt-1">
                {inputJd.length} characters {inputJd.length < 100 && '(minimum 100)'}
              </p>
            </div>

            {/* Intake Notes */}
            <div>
              <label htmlFor="inputIntake" className="block text-sm font-semibold text-text-primary mb-2">
                Intake Notes (Optional)
              </label>
              <p className="text-xs text-text-muted mb-2">
                Add any additional context from hiring manager conversations, must-haves, nice-to-haves, etc.
              </p>
              <textarea
                id="inputIntake"
                value={inputIntake}
                onChange={(e) => setInputIntake(e.target.value)}
                placeholder="e.g., Must have hands-on experience with RLHF pipelines. Nice to have: experience at OpenAI, Anthropic, or DeepMind."
                rows={4}
                className="search-input w-full px-4 py-3 rounded-md text-sm focus:outline-none resize-y"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-4 border-t border-border-primary">
              <p className="text-xs text-text-muted">
                Generation uses Claude to build 4-6 blocks with 48-72 Boolean clusters.
              </p>
              <button
                type="submit"
                disabled={!isFormValid}
                className={`px-6 py-3 font-semibold text-sm rounded-md transition-all ${
                  isFormValid
                    ? 'bg-accent-blue text-bg-primary hover:opacity-90'
                    : 'bg-bg-tertiary text-text-muted cursor-not-allowed'
                }`}
              >
                Generate Search Kit
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
