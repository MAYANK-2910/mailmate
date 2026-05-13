import React from 'react';
import { Email } from '../../types/email';

interface CompactThreadProps {
  email: Email;
}

export const CompactThread: React.FC<CompactThreadProps> = ({ email }) => {
  return (
    <div className="max-w-3xl mx-auto py-6 space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-text-primary">{email.subject}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-medium text-text-primary">{email.from.name}</span>
            <span className="text-xs text-text-muted"><{email.from.email}></span>
          </div>
        </div>
      </div>
      
      <div className="prose prose-sm max-w-none text-text-primary leading-relaxed">
        {/* Render sanitized HTML body here */}
        <div dangerouslySetInnerHTML={{ __html: email.body || email.snippet }} />
      </div>
    </div>
  );
};
