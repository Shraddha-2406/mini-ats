import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Award,
  ChevronDown,
  Briefcase,
  Eye,
  Sliders,
  Check,
  X,
  FileText,
  Mail,
  GraduationCap,
  Sparkles,
  ArrowUpDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  getJobs,
  getRankedCandidatesForJob,
  getApplications,
  updateApplicationStatus,
} from '../services/dataService';
import { getMatchScoreColor } from '../services/matchingService';
import { Sidebar } from '../components/Sidebar';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/Modal';

export const ScreeningRankingPage = () => {
  const { currentUser } = useAuth();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [rankedCandidates, setRankedCandidates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'All');
  const [scoreFilter, setScoreFilter] = useState('All');
  const [selectedCandidateModal, setSelectedCandidateModal] = useState(null);

  // Load jobs list
  useEffect(() => {
    const allJobs = getJobs();
    setJobs(allJobs);
    if (allJobs.length > 0) {
      const initialJobId = searchParams.get('jobId') || allJobs[0].id;
      setSelectedJobId(initialJobId);
    }
  }, []);

  // Refresh ranked candidate list whenever selected job changes
  const loadRankings = (jobId) => {
    if (!jobId) return;
    const ranked = getRankedCandidatesForJob(jobId);
    setRankedCandidates(ranked);
  };

  useEffect(() => {
    if (selectedJobId) {
      loadRankings(selectedJobId);
    }
  }, [selectedJobId]);

  const selectedJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];

  // KPI counts for this job
  const totalCount = rankedCandidates.length;
  const shortlistedCount = rankedCandidates.filter((c) => c.status === 'Shortlisted').length;
  const pendingCount = rankedCandidates.filter((c) => c.status === 'Pending').length;
  const rejectedCount = rankedCandidates.filter((c) => c.status === 'Rejected').length;

  // Filter candidates
  const filteredCandidates = rankedCandidates.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      c.candidateName.toLowerCase().includes(q) ||
      c.candidateEmail.toLowerCase().includes(q) ||
      c.candidateSkills.some((s) => s.toLowerCase().includes(q));

    const matchesStatus =
      statusFilter === 'All' || c.status.toLowerCase() === statusFilter.toLowerCase();

    let matchesScore = true;
    if (scoreFilter === 'high') matchesScore = c.matchScore >= 80;
    else if (scoreFilter === 'moderate') matchesScore = c.matchScore >= 50 && c.matchScore < 80;
    else if (scoreFilter === 'low') matchesScore = c.matchScore < 50;

    return matchesSearch && matchesStatus && matchesScore;
  });

  // Handle Manual Status Change
  const handleStatusChange = (appId, newStatus, reason = '') => {
    const updated = updateApplicationStatus(appId, newStatus, reason);
    if (updated) {
      toast.success(`Candidate status manually updated to "${newStatus}".`);
      loadRankings(selectedJobId);
      if (selectedCandidateModal && selectedCandidateModal.applicationId === appId) {
        setSelectedCandidateModal({ ...selectedCandidateModal, status: newStatus });
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex">
      {/* Recruiter Sidebar */}
      <Sidebar role="recruiter" />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 overflow-y-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Deterministic Candidate Evaluation Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Candidate Screening & Ranking
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Automated ranking ordered by skill match percentage, with threshold evaluation and manual overrides.
            </p>
          </div>

          {/* Job Selection Dropdown */}
          <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-subtle flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 pl-2">Filter by Job:</span>
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title} — {job.company} (Threshold: {job.threshold}%)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Job Banner & Metric Summary */}
        {selectedJob && (
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-subtle space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-base flex items-center justify-center shadow-sm">
                  {selectedJob.companyLogo || selectedJob.company.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">{selectedJob.title}</h2>
                  <p className="text-xs text-slate-500">
                    {selectedJob.company} • {selectedJob.location} • {selectedJob.type}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200">
                  Shortlisting Threshold: <strong>{selectedJob.threshold}%</strong>
                </span>
                <Link
                  to={`/match-analysis?jobId=${selectedJob.id}`}
                  className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700"
                >
                  Match Matrix
                </Link>
              </div>
            </div>

            {/* 4 Mini Stat Pills for this specific job */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Total Applicants
                </span>
                <p className="text-2xl font-black text-slate-900 mt-0.5">{totalCount}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Shortlisted
                </span>
                <p className="text-2xl font-black text-emerald-700 mt-0.5">{shortlistedCount}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                  Pending Review
                </span>
                <p className="text-2xl font-black text-amber-700 mt-0.5">{pendingCount}</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700">
                  Rejected
                </span>
                <p className="text-2xl font-black text-rose-700 mt-0.5">{rejectedCount}</p>
              </div>
            </div>

            {/* Required Skills Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="font-semibold text-slate-500">Required Skills evaluated:</span>
              {selectedJob.requiredSkills.map((sk, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 font-medium"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Filter Controls Toolbar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate name, email, or skill..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option value="All">All Statuses</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Pending">Pending Review</option>
              <option value="Rejected">Rejected</option>
            </select>

            {/* Score Filter */}
            <select
              value={scoreFilter}
              onChange={(e) => setScoreFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option value="All">All Match Scores</option>
              <option value="high">80–100% (High Match)</option>
              <option value="moderate">50–79% (Moderate Match)</option>
              <option value="low">0–49% (Low Match)</option>
            </select>
          </div>
        </div>

        {/* RANKINGS TABLE */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-subtle space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Applicant Rankings</h3>
              <p className="text-xs text-slate-500">
                Sorted by Match Score in descending order. Threshold criteria: {selectedJob?.threshold}%
              </p>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Showing {filteredCandidates.length} candidate(s)
            </span>
          </div>

          {filteredCandidates.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No applicants found</p>
              <p className="text-xs text-slate-400">
                Try switching jobs or clearing active search and status filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-3">Rank</th>
                    <th className="py-3 px-3">Candidate</th>
                    <th className="py-3 px-3">Skills Overlap</th>
                    <th className="py-3 px-3">Match Score</th>
                    <th className="py-3 px-3">Threshold Met?</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCandidates.map((c) => {
                    const scoreTheme = getMatchScoreColor(c.matchScore);

                    // Rank medal badge styling
                    let rankBadge = (
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-extrabold text-xs flex items-center justify-center">
                        #{c.rank}
                      </span>
                    );
                    if (c.rank === 1) {
                      rankBadge = (
                        <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-xs flex items-center justify-center shadow-sm" title="Rank 1 Top Candidate">
                          🥇
                        </span>
                      );
                    } else if (c.rank === 2) {
                      rankBadge = (
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 border border-slate-300 font-extrabold text-xs flex items-center justify-center shadow-sm" title="Rank 2">
                          🥈
                        </span>
                      );
                    } else if (c.rank === 3) {
                      rankBadge = (
                        <span className="w-6 h-6 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-extrabold text-xs flex items-center justify-center shadow-sm" title="Rank 3">
                          🥉
                        </span>
                      );
                    }

                    return (
                      <tr key={c.applicationId} className="hover:bg-slate-50 transition-colors">
                        {/* Rank */}
                        <td className="py-4 px-3 font-bold">{rankBadge}</td>

                        {/* Candidate Name & Info */}
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                              {c.candidateName.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 leading-snug">
                                {c.candidateName}
                              </p>
                              <p className="text-[11px] text-slate-400">{c.candidateEmail}</p>
                              {c.candidateDegree && (
                                <p className="text-[10px] text-slate-500 truncate max-w-[200px]">
                                  {c.candidateDegree}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Skills Overlap */}
                        <td className="py-4 px-3">
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-slate-700">
                              {c.matchedCount} of {c.totalRequired} Matched
                            </span>
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {c.matchedSkills.map((sk, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded font-semibold border border-emerald-200"
                                >
                                  ✓ {sk}
                                </span>
                              ))}
                              {c.missingSkills.map((sk, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded font-medium border border-rose-200"
                                >
                                  ✗ {sk}
                                </span>
                              ))}
                            </div>
                          </div>
                        </td>

                        {/* Match Score */}
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-slate-100 rounded-full h-2.5 overflow-hidden">
                              <div
                                className={`h-2.5 rounded-full ${scoreTheme.progressBg}`}
                                style={{ width: `${c.matchScore}%` }}
                              />
                            </div>
                            <span className={`text-xs font-black ${scoreTheme.textClass}`}>
                              {c.matchScore}%
                            </span>
                          </div>
                        </td>

                        {/* Threshold Met */}
                        <td className="py-4 px-3">
                          {c.meetsThreshold ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Yes (≥{c.threshold}%)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                              No (&lt;{c.threshold}%)
                            </span>
                          )}
                        </td>

                        {/* Current Status */}
                        <td className="py-4 px-3">
                          <StatusBadge status={c.status} size="sm" />
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-3 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedCandidateModal(c)}
                              className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors flex items-center gap-1"
                              title="Inspect Full Candidate Profile & Missing Skills"
                            >
                              <Eye className="w-3.5 h-3.5 text-blue-600" />
                              <span>Details</span>
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleStatusChange(
                                  c.applicationId,
                                  'Shortlisted',
                                  'Manually approved by recruiter'
                                )
                              }
                              className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                              title="Shortlist Candidate"
                            >
                              <Check className="w-4 h-4 stroke-[2.5]" />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleStatusChange(
                                  c.applicationId,
                                  'Rejected',
                                  'Does not meet current role expectations'
                                )
                              }
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Reject Candidate"
                            >
                              <X className="w-4 h-4 stroke-[2.5]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Candidate Deep Screening Modal */}
      {selectedCandidateModal && (
        <Modal
          isOpen={!!selectedCandidateModal}
          onClose={() => setSelectedCandidateModal(null)}
          title={`Screening: ${selectedCandidateModal.candidateName}`}
          subtitle={`Application for ${selectedCandidateModal.jobTitle} • Rank #${selectedCandidateModal.rank}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            {/* Top Score & Formula Card */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Evaluation Formula
                </span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  ({selectedCandidateModal.matchedCount} Matched /{' '}
                  {selectedCandidateModal.totalRequired} Required) × 100 ={' '}
                  <span className="text-blue-600 font-black text-lg">
                    {selectedCandidateModal.matchScore}%
                  </span>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Threshold Required: {selectedCandidateModal.threshold}% •{' '}
                  {selectedCandidateModal.meetsThreshold ? (
                    <strong className="text-emerald-700">Eligible for Shortlisting</strong>
                  ) : (
                    <strong className="text-amber-700">Below Shortlist Threshold</strong>
                  )}
                </p>
              </div>

              <StatusBadge status={selectedCandidateModal.status} size="lg" />
            </div>

            {/* Candidate Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-400 font-bold block text-[10px]">EMAIL</span>
                <span className="font-semibold text-slate-800">{selectedCandidateModal.candidateEmail}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-400 font-bold block text-[10px]">PHONE</span>
                <span className="font-semibold text-slate-800">{selectedCandidateModal.candidatePhone || 'Not provided'}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-400 font-bold block text-[10px]">EDUCATION</span>
                <span className="font-semibold text-slate-800">{selectedCandidateModal.candidateEducation || 'Engineering College'}</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-400 font-bold block text-[10px]">DEGREE</span>
                <span className="font-semibold text-slate-800">{selectedCandidateModal.candidateDegree || 'B.E. Computer Science'}</span>
              </div>
            </div>

            {/* Matched Skills */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Matched Technical Skills ({selectedCandidateModal.matchedSkills.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selectedCandidateModal.matchedSkills.map((sk, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Missing Required Skills ({selectedCandidateModal.missingSkills.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selectedCandidateModal.missingSkills.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">None - Complete 100% skill match!</span>
                ) : (
                  selectedCandidateModal.missingSkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-3 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 font-bold flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5 text-rose-500" />
                      {sk}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Manual Status Override Controls */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-800">Recruiter Manual Override</p>
                <p className="text-[11px] text-slate-500">
                  You can override the algorithm's automatic decision at any time.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleStatusChange(selectedCandidateModal.applicationId, 'Shortlisted')
                  }
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm"
                >
                  Shortlist
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleStatusChange(selectedCandidateModal.applicationId, 'Pending')
                  }
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm"
                >
                  Mark Pending
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleStatusChange(selectedCandidateModal.applicationId, 'Rejected')
                  }
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
