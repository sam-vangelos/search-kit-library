'use client';

import { useState } from 'react';

interface EmailPromptModalProps {
  onSubmit: (email: string) => void;
}

export function EmailPromptModal({ onSubmit }: EmailPromptModalProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      setError('Please enter your email');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email');
      return;
    }

    onSubmit(trimmedEmail);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-bg-secondary border border-border-primary rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
        <h2 className="text-xl font-bold text-text-primary mb-2">Welcome to Search Kit Library</h2>
        <p className="text-sm text-text-secondary mb-6">
          Enter your email to sync favorites across devices.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            placeholder="you@company.com"
            className="w-full px-4 py-3 bg-bg-primary border border-border-primary rounded-md text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue"
            autoFocus
          />

          {error && (
            <p className="text-red-400 text-sm mt-2">{error}</p>
          )}

          <button
            type="submit"
            className="w-full mt-4 px-4 py-3 bg-accent-blue text-bg-primary font-semibold rounded-md hover:opacity-90 transition-opacity"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
