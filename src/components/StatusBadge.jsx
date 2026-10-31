import React from 'react';
import { CheckCircle2, Clock, XCircle, AlertCircle, Briefcase } from 'lucide-react';

export const StatusBadge = ({ status, size = 'md' }) => {
  const norm = (status || '').toLowerCase();

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs font-semibold px-2.5 py-1',
    lg: 'text-sm font-semibold px-3 py-1.5',
  };

  if (norm === 'shortlisted' || norm === 'selected') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses[size]}`}
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        Shortlisted
      </span>
    );
  }

  if (norm === 'pending' || norm === 'under review') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 ${sizeClasses[size]}`}
      >
        <Clock className="w-3.5 h-3.5 text-amber-600" />
        Pending Review
      </span>
    );
  }

  if (norm === 'rejected') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${sizeClasses[size]}`}
      >
        <XCircle className="w-3.5 h-3.5 text-rose-600" />
        Rejected
      </span>
    );
  }

  if (norm === 'active') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 ${sizeClasses[size]}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
        Active
      </span>
    );
  }

  if (norm === 'closed') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 ${sizeClasses[size]}`}
      >
        Closed
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses[size]}`}
    >
      {status}
    </span>
  );
};
