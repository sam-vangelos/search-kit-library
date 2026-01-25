'use client';

interface InfoModalProps {
  onClose: () => void;
}

export function InfoModal({ onClose }: InfoModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-bg-secondary border border-border-primary rounded-lg p-6 w-full max-w-lg mx-4 shadow-xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text-primary">About Search Kit Library</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold text-text-primary mb-1">What is this?</h3>
            <p className="text-text-secondary">
              Search Kit Library stores AI-generated boolean search strings for talent sourcing.
              Paste a job description and get ready-to-use search queries for LinkedIn, GitHub, and other platforms.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-text-primary mb-1">How to use</h3>
            <ol className="text-text-secondary list-decimal list-inside space-y-1">
              <li>Click "Generate New Kit" with a job description</li>
              <li>Browse the generated blocks and archetypes</li>
              <li>Copy search strings directly to your sourcing platform</li>
              <li>Favorite kits to access them later</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-text-primary mb-2">Glossary</h3>
            <dl className="space-y-2 text-text-secondary">
              <div>
                <dt className="font-medium text-accent-blue">Blocks</dt>
                <dd className="ml-3">Top-level search categories (e.g., "Job Titles", "Skills", "Companies")</dd>
              </div>
              <div>
                <dt className="font-medium text-accent-blue">SubBlocks</dt>
                <dd className="ml-3">Subcategories within a block (e.g., "Programming Languages" under Skills)</dd>
              </div>
              <div>
                <dt className="font-medium text-accent-blue">Clusters</dt>
                <dd className="ml-3">Groups of related search terms at different specificity levels</dd>
              </div>
              <div>
                <dt className="font-medium text-accent-blue">Specificity Levels</dt>
                <dd className="ml-3">
                  <span className="text-accent-orange">Recent</span> = cutting-edge terms,
                  <span className="text-text-secondary"> High</span> = exact matches,
                  <span className="text-text-secondary"> Medium</span> = related terms,
                  <span className="text-text-secondary"> Low</span> = broad alternatives
                </dd>
              </div>
              <div>
                <dt className="font-medium text-accent-blue">Archetypes</dt>
                <dd className="ml-3">Candidate personas with pre-built search recipes combining multiple blocks</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
