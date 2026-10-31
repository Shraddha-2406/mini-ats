import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  XCircle,
  Briefcase,
  ArrowRight,
  ChevronLeft,
  Sparkles,
  BookOpen,
  TrendingUp,
  Layers,
  MapPin,
  Clock,
  ExternalLink,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  getJobs,
  getApplications,
  createApplication,
} from '../services/dataService';
import {
  calculateMatch,
  getMatchScoreColor,
  generateSkillRecommendations,
} from '../services/matchingService';
import { MatchScoreRing } from '../components/MatchScoreRing';
import { StatusBadge } from '../components/StatusBadge';
import { Sidebar } from '../components/Sidebar';

export const MatchAnalysisPage = () => {
  const { currentUser, role } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [applications, setApplications] = useState([]);

  // Load jobs and current applications
  useEffect(() => {
    const allJobs = getJobs().filter((j) => j.status === 'Active');
    setJobs(allJobs);

    const paramJobId = searchParams.get('jobId');
    if (paramJobId && allJobs.some((j) => j.id === paramJobId)) {
      setSelectedJobId(paramJobId);
    } else if (allJobs.length > 0) {
      setSelectedJobId(allJobs[0].id);
    }

    if (currentUser) {
      const myApps = getApplications({ candidateId: currentUser.id });
      setApplications(myApps);
    }
  }, [currentUser, searchParams]);

  const selectedJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];
  const candidateSkills = currentUser?.skills || [];

  if (!selectedJob) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">No active jobs found for match analysis.</p>
      </div>
    );
  }

  // Calculate detailed match
  const matchResult = calculateMatch(
    candidateSkills,
    selectedJob.requiredSkills,
    selectedJob.threshold
  );

  const {
    matchScore,
    matchedSkills,
    missingSkills,
    additionalSkills,
    totalRequired,
    matchedCount,
    meetsThreshold,
  } = matchResult;

  const scoreTheme = getMatchScoreColor(matchScore);
  const recommendations = generateSkillRecommendations(
    matchedCount,
    totalRequired,
    missingSkills,
    selectedJob.threshold
  );

  // Check if candidate already applied
  const existingApp = applications.find((a) => a.jobId === selectedJob.id);
  const isApplied = !!existingApp;

  // Handle Apply
  const handleApply = () => {
    if (!currentUser) {
      toast.warning('Please log in as a candidate to apply.');
      navigate('/auth');
      return;
    }
    const res = createApplication(selectedJob.id, currentUser.id);
    if (!res.success) {
      toast.warning(res.message);
    } else {
      toast.success(
        res.application.status === 'Shortlisted'
          ? `Application submitted and automatically Shortlisted (Met ${selectedJob.threshold}% threshold)!`
          : `Application submitted as Pending Review.`
      );
      setApplications(getApplications({ candidateId: currentUser.id }));
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar role={role === 'recruiter' ? 'recruiter' : 'candidate'} />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 overflow-y-auto">
        {/* Top Header & Job Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors mb-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Job Listings</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Your Job Match Analysis
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Detailed technical gap analysis comparing candidate skills with job requisitions.
            </p>
          </div>

          {/* Job Selection Dropdown */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-subtle flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 pl-2">Select Target Job:</span>
            <select
              value={selectedJobId}
              onChange={(e) => {
                setSelectedJobId(e.target.value);
                setSearchParams({ jobId: e.target.value });
              }}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title} — {job.company}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Target Job Detail Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-lg flex items-center justify-center flex-shrink-0 shadow-sm">
              {selectedJob.companyLogo || selectedJob.company.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {selectedJob.title}
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {selectedJob.type}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-600 mt-0.5">
                {selectedJob.company} • {selectedJob.location} • {selectedJob.experience}
              </p>
              <p className="text-xs text-slate-500 mt-2 max-w-2xl leading-relaxed">
                {selectedJob.description}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-3 flex-shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
            {isApplied ? (
              <div className="flex items-center gap-2">
                <StatusBadge status={existingApp.status} size="lg" />
              </div>
            ) : (
              <button
                type="button"
                onClick={handleApply}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all"
              >
                Apply for this Role
              </button>
            )}
            <span className="text-xs text-slate-400">
              Shortlist Threshold: <strong>{selectedJob.threshold}%</strong>
            </span>
          </div>
        </div>

        {/* MAIN ANALYSIS: Large Circular Match Score & Metric Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Large Circular Gauge Card (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-subtle flex flex-col items-center justify-center text-center space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Overall Compatibility Score
            </span>

            <div className="my-2">
              <MatchScoreRing score={matchScore} size="xl" showLabel={true} />
            </div>

            <div className="space-y-1">
              <span className={`text-base font-extrabold ${scoreTheme.textClass}`}>
                {scoreTheme.label} ({matchScore}%)
              </span>
              <p className="text-xs text-slate-500 max-w-xs">
                {matchResult.formulaExplanation}
              </p>
            </div>

            <div className="w-full pt-4 border-t border-slate-100">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Shortlisting Eligibility:</span>
                {meetsThreshold ? (
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Eligible (≥{selectedJob.threshold}%)
                  </span>
                ) : (
                  <span className="font-bold text-amber-700 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    Below ({matchScore}% vs {selectedJob.threshold}%)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: 3 Key Metrics + Progress Bar (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-subtle text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Matched Skills
                </span>
                <p className="text-3xl font-black text-emerald-600 mt-1">{matchedCount}</p>
                <p className="text-[11px] text-slate-400 mt-1">Verified on profile</p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-subtle text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Total Required
                </span>
                <p className="text-3xl font-black text-slate-900 mt-1">{totalRequired}</p>
                <p className="text-[11px] text-slate-400 mt-1">Specified by job</p>
              </div>

              <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-subtle text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">
                  Missing Skills
                </span>
                <p className="text-3xl font-black text-rose-600 mt-1">{missingSkills.length}</p>
                <p className="text-[11px] text-slate-400 mt-1">Need to acquire</p>
              </div>
            </div>

            {/* Linear Progress Bar Breakdown */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-subtle space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Skill Match Progress</span>
                <span className="font-extrabold text-blue-600">{matchScore}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-700 ${scoreTheme.progressBg}`}
                  style={{ width: `${matchScore}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400">
                <span>0%</span>
                <span className="font-semibold text-blue-600">
                  Threshold: {selectedJob.threshold}%
                </span>
                <span>100%</span>
              </div>
            </div>

            {/* Rule-Based Recommendations Card */}
            <div className="bg-gradient-to-br from-blue-50/70 to-indigo-50/70 rounded-3xl p-6 border border-blue-200 space-y-3">
              <div className="flex items-center gap-2 text-blue-900">
                <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <h3 className="text-sm font-bold">Rule-Based Skill Recommendations</h3>
              </div>
              <p className="text-xs sm:text-sm text-blue-950 font-medium leading-relaxed">
                {recommendations.summary}
              </p>
              <ul className="space-y-1.5 pt-1 text-xs text-blue-900/90">
                {recommendations.recommendationList.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-2 text-[10px] text-blue-700/70">
                Note: Recommendations are generated via deterministic skill requirement gap analysis.
              </div>
            </div>
          </div>
        </div>

        {/* SKILL COMPARISON MATRIX */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-subtle space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-lg font-bold text-slate-900">Skill Comparison Matrix</h3>
            <p className="text-xs text-slate-500">
              Clear side-by-side comparison between job prerequisites and your verified candidate skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Matched Skills Panel */}
            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Matched Skills ({matchedSkills.length})</span>
                </div>
                <span className="text-xs font-bold text-emerald-700">
                  {matchedCount}/{totalRequired}
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Skills you possess that directly satisfy job requirements:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {matchedSkills.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">None matched yet</span>
                ) : (
                  matchedSkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-white text-emerald-800 border border-emerald-200 font-bold text-xs shadow-sm flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {sk}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Missing Skills Panel */}
            <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase tracking-wider">
                  <XCircle className="w-4 h-4 text-rose-600" />
                  <span>Missing Skills ({missingSkills.length})</span>
                </div>
                <span className="text-xs font-bold text-rose-700">
                  {missingSkills.length} Needed
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Skills required by this role that are currently not on your profile:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {missingSkills.length === 0 ? (
                  <span className="text-xs text-emerald-700 font-semibold">
                    ✓ Perfect Match! No required skills are missing.
                  </span>
                ) : (
                  missingSkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-white text-rose-800 border border-rose-200 font-bold text-xs shadow-sm flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5 text-rose-500" />
                      {sk}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Additional / Bonus Skills */}
          {additionalSkills.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Additional Bonus Skills on Your Profile ({additionalSkills.length}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {additionalSkills.map((sk, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-white text-slate-700 border border-slate-200 text-xs font-medium"
                  >
                    + {sk}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <Link
              to="/resume-skills"
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition-colors"
            >
              Update Your Profile Skills
            </Link>

            <div className="flex items-center gap-3">
              <Link
                to="/jobs"
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs"
              >
                Browse Other Jobs
              </Link>
              {!isApplied && (
                <button
                  type="button"
                  onClick={handleApply}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm"
                >
                  Apply for this Role
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
