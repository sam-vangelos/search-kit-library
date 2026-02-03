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
        className="bg-bg-secondary border border-border-primary rounded-lg w-full max-w-2xl mx-4 shadow-xl max-h-[85vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-primary shrink-0">
          <h2 className="text-xl font-bold text-text-primary">How to Use Search Kit Library</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-6 py-5 space-y-6">

          {/* Quick Start */}
          <section>
            <h3 className="text-sm font-bold text-accent-blue uppercase tracking-wide mb-3">Quick Start</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Search Kit Library transforms job descriptions into ready-to-use boolean search strings.
              Generate a kit, copy the strings you need, paste into LinkedIn Recruiter or any sourcing platform.
            </p>
          </section>

          {/* The Workflow */}
          <section>
            <h3 className="text-sm font-bold text-accent-blue uppercase tracking-wide mb-3">The Workflow</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 bg-accent-blue/15 text-accent-blue text-xs font-bold rounded shrink-0">1</span>
                <div>
                  <p className="text-sm font-medium text-text-primary">Generate a Kit</p>
                  <p className="text-xs text-text-muted">Paste your JD + any intake notes. The more detail, the better the output.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 bg-accent-blue/15 text-accent-blue text-xs font-bold rounded shrink-0">2</span>
                <div>
                  <p className="text-sm font-medium text-text-primary">Browse & Copy</p>
                  <p className="text-xs text-text-muted">Expand blocks to find relevant search strings. Click the copy icon on any string.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 bg-accent-blue/15 text-accent-blue text-xs font-bold rounded shrink-0">3</span>
                <div>
                  <p className="text-sm font-medium text-text-primary">Combine with AND</p>
                  <p className="text-xs text-text-muted">Copy strings from different blocks and AND them together for targeted searches.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex items-center justify-center w-6 h-6 bg-accent-blue/15 text-accent-blue text-xs font-bold rounded shrink-0">4</span>
                <div>
                  <p className="text-sm font-medium text-text-primary">Evaluate Candidates</p>
                  <p className="text-xs text-text-muted">Click "Evaluate Leads" to copy a screening prompt. Paste into ChatGPT/Claude with candidate profiles.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Understanding Your Kit */}
          <section>
            <h3 className="text-sm font-bold text-accent-blue uppercase tracking-wide mb-3">Understanding Your Kit</h3>

            <div className="space-y-4">
              {/* Archetypes */}
              <div className="bg-bg-tertiary border border-border-primary rounded-md p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-accent-green text-xs font-bold">ARCHETYPES</span>
                </div>
                <p className="text-xs text-text-secondary mb-2">
                  Candidate personas that fit the role. Each archetype has a "recipe" showing which blocks to combine.
                </p>
                <p className="text-xs text-text-muted italic">
                  Use when: You want a starting point for who to target, not just what terms to search.
                </p>
              </div>

              {/* Blocks */}
              <div className="bg-bg-tertiary border border-border-primary rounded-md p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-accent-blue text-xs font-bold">BLOCKS</span>
                  <span className="text-text-muted">→</span>
                  <span className="text-accent-cyan text-xs font-bold">SUB-BLOCKS</span>
                  <span className="text-text-muted">→</span>
                  <span className="text-text-secondary text-xs font-bold">CLUSTERS</span>
                </div>
                <p className="text-xs text-text-secondary mb-2">
                  <strong>Blocks</strong> are competency domains (e.g., "ML Infrastructure").
                  <strong> Sub-blocks</strong> break these into Concepts, Methods, and Tools.
                  <strong> Clusters</strong> are the actual boolean strings grouped by specificity.
                </p>
                <p className="text-xs text-text-muted italic">
                  Use when: Building custom searches by combining terms across different competency areas.
                </p>
              </div>

              {/* Cluster Types */}
              <div className="bg-bg-tertiary border border-border-primary rounded-md p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-text-primary text-xs font-bold">CLUSTER TYPES</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-medium text-text-primary">Recall</span>
                    <span className="text-text-muted"> — Broad anchors that get you to the right cohort. High volume, some noise.</span>
                  </div>
                  <div>
                    <span className="font-medium text-accent-orange">Precision</span>
                    <span className="text-text-muted"> — Specific/jargony terms that confirm deep expertise. Low volume, high signal.</span>
                  </div>
                </div>
                <p className="text-xs text-text-muted mt-2 italic">
                  Power move: AND a Recall cluster with a Precision cluster for filtered, targeted searches.
                </p>
              </div>
            </div>
          </section>

          {/* Pro Tips */}
          <section>
            <h3 className="text-sm font-bold text-accent-blue uppercase tracking-wide mb-3">Pro Tips</h3>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li className="flex gap-2">
                <span className="text-accent-orange">•</span>
                <span><strong>Include intake notes</strong> — They're weighted higher than the JD in evaluation prompts.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent-orange">•</span>
                <span><strong>Start with Recall</strong> — Then AND with Precision clusters to filter to specialists.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent-orange">•</span>
                <span><strong>Mix blocks with AND</strong> — e.g., (Skills block) AND (Tools block) for targeted outreach.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-accent-orange">•</span>
                <span><strong>Favorite frequently-used kits</strong> — They appear in your Favorites tab for quick access.</span>
              </li>
            </ul>
          </section>

        </div>
      </div>
    </div>
  );
}
