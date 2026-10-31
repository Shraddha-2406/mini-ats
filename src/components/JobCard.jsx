import React from 'react';
import { MapPin, Briefcase, Clock, CheckCircle2, ChevronRight, Award } from 'lucide-react';
import { getMatchScoreColor } from '../services/matchingService';
import { StatusBadge } from './StatusBadge';

export const JobCard = ({
  job,
  candidateSkills = [],
  isApplied = false,
  applicationStatus = null,
  onApply,
  onViewDetails,
  onViewMatchAnalysis,
  showMatchScore = true,
}) => {
  // Compute matching skills
  const candSet = new Set((candidateSkills || []).map((s) => s.toLowerCase().trim()));
  const requiredSkills = job.requiredSkills || [];

  const matchedCount = requiredSkills.filter((s) =>
    candSet.has(s.toLowerCase().trim())
  ).length;

  const totalRequired = requiredSkills.length;
  const matchScore = totalRequired > 0 ? Math.round((matchedCount / totalRequired) * 100) : 100;
  const scoreTheme = getMatchScoreColor(matchScore);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-subtle hover:shadow-card hover:border-slate-300 transition-all duration-200 p-5 sm:p-6 flex flex-col justify-between group">
      <div>
        {/* Top Header: Company Logo, Title, and Match Score Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-sm flex-shrink-0">
              {job.companyLogo || (job.company || 'TN').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                {job.title}
              </h3>
              <p className="text-xs sm:text-sm font-medium text-slate-600">{job.company}</p>
            </div>
          </div>

          {/* Match Score Badge (Only when relevant for candidate) */}
          {showMatchScore && candidateSkills.length > 0 && (
            <div
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${scoreTheme.badgeClass} flex-shrink-0 cursor-pointer`}
              onClick={() => onViewMatchAnalysis && onViewMatchAnalysis(job)}
              title="Click to view detailed match breakdown"
            >
              <Award className="w-3.5 h-3.5" />
              <span>{matchScore}% Match</span>
            </div>
          )}
        </div>

        {/* Metadata Tags: Location, Type, Experience */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-4">
          <span className="inline-flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/60 font-medium">
            <MapPin className="w-3 h-3 text-slate-400" />
            {job.location}
          </span>
          <span className="inline-flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/60 font-medium">
            <Briefcase className="w-3 h-3 text-slate-400" />
            {job.type}
          </span>
          <span className="inline-flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200/60 font-medium">
            <Clock className="w-3 h-3 text-slate-400" />
            {job.experience}
          </span>
          <span className="inline-flex items-center gap-1 bg-blue-50/60 text-blue-700 px-2.5 py-1 rounded-md border border-blue-200/60 font-medium">
            Min. Threshold: {job.threshold || 80}%
          </span>
        </div>

        {/* Job Description Preview */}
        <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {job.description}
        </p>

        {/* Required Skills list with match highlighting */}
        <div className="mb-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Required Skills ({matchedCount}/{totalRequired} matched):
          </p>
          <div className="flex flex-wrap gap-1.5">
            {requiredSkills.slice(0, 5).map((skill, idx) => {
              const isMatched = candSet.has(skill.toLowerCase().trim());
              return (
                <span
                  key={idx}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium inline-flex items-center gap-1 border ${
                    isMatched
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  {isMatched && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                  {skill}
                </span>
              );
            })}
            {requiredSkills.length > 5 && (
              <span className="text-xs text-slate-500 font-medium self-center pl-1">
                +{requiredSkills.length - 5} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onViewDetails && onViewDetails(job)}
          className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors inline-flex items-center gap-1"
        >
          View Details
          <ChevronRight className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          {isApplied ? (
            <div className="flex items-center gap-2">
              <StatusBadge status={applicationStatus || 'Applied'} size="md" />
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onApply && onApply(job)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
