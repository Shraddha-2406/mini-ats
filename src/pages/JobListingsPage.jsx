import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Briefcase,
  MapPin,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Layers,
  Sparkles,
  ExternalLink,
  X,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getJobs, getApplications, createApplication } from '../services/dataService';
import { calculateMatch } from '../services/matchingService';
import { JobCard } from '../components/JobCard';
import { Modal } from '../components/Modal';
import { MatchScoreRing } from '../components/MatchScoreRing';
import { StatusBadge } from '../components/StatusBadge';

export const JobListingsPage = () => {
  const { currentUser, role } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedExp, setSelectedExp] = useState('All');
  const [sortBy, setSortBy] = useState('match'); // 'match' | 'newest' | 'title'
  const [selectedJobForModal, setSelectedJobForModal] = useState(null);

  // Load jobs and applications
  const refreshData = () => {
    const allJobs = getJobs().filter((j) => j.status === 'Active');
    setJobs(allJobs);

    if (currentUser) {
      const myApps = getApplications({ candidateId: currentUser.id });
      setApplications(myApps);
    }
  };

  useEffect(() => {
    refreshData();
  }, [currentUser]);

  const candidateSkills = currentUser?.skills || [];

  // Filter and sort jobs
  const filteredJobs = jobs
    .filter((job) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.requiredSkills.some((s) => s.toLowerCase().includes(q)) ||
        job.location.toLowerCase().includes(q);

      const matchesType =
        selectedType === 'All' || job.type.toLowerCase() === selectedType.toLowerCase();

      const matchesExp =
        selectedExp === 'All' || job.experience.toLowerCase().includes(selectedExp.toLowerCase());

      return matchesSearch && matchesType && matchesExp;
    })
    .sort((a, b) => {
      if (sortBy === 'match' && candidateSkills.length > 0) {
        const matchA = calculateMatch(candidateSkills, a.requiredSkills, a.threshold).matchScore;
        const matchB = calculateMatch(candidateSkills, b.requiredSkills, b.threshold).matchScore;
        return matchB - matchA;
      }
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return a.title.localeCompare(b.title);
    });

  // Handle Application Submission
  const handleApply = (job) => {
    if (!currentUser) {
      toast.warning('Please log in as a candidate to apply for jobs.');
      navigate('/auth');
      return;
    }

    if (currentUser.role !== 'candidate') {
      toast.warning('Recruiters cannot apply for jobs. Please switch to a candidate account.');
      return;
    }

    const res = createApplication(job.id, currentUser.id);
    if (!res.success) {
      toast.warning(res.message);
    } else {
      if (res.application.status === 'Shortlisted') {
        toast.success(
          `Application submitted! You met the ${job.threshold}% threshold and were Shortlisted!`
        );
      } else {
        toast.info(
          `Application submitted! Match score: ${res.application.matchScore}%. Application is Pending review.`
        );
      }
      refreshData();
      if (selectedJobForModal) {
        setSelectedJobForModal(null);
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Career Opportunities</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Explore Opportunities
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Discover openings matched in real time with your verified skill profile
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-subtle">
              Showing <strong className="text-slate-900">{filteredJobs.length}</strong> of{' '}
              {jobs.length} Active Positions
            </span>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-subtle space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Bar */}
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search job title, company, or required skill (e.g. Python, SQL)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Job Type Filter */}
            <div className="sm:col-span-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              >
                <option value="All">All Job Types</option>
                <option value="Full-Time">Full-Time</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            {/* Experience Filter */}
            <div className="sm:col-span-2">
              <select
                value={selectedExp}
                onChange={(e) => setSelectedExp(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              >
                <option value="All">All Experience</option>
                <option value="0-1">0-1 years</option>
                <option value="1-3">1-3 years</option>
                <option value="2-4">2-4 years</option>
              </select>
            </div>

            {/* Sort Options */}
            <div className="sm:col-span-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
              >
                <option value="match">Highest Match %</option>
                <option value="newest">Newest Posted</option>
                <option value="title">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Active Candidate Skills Match Bar */}
          {candidateSkills.length > 0 && (
            <div className="pt-2 flex flex-wrap items-center justify-between text-xs text-slate-500 border-t border-slate-100 gap-2">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-slate-700">Matching against your skills:</span>
                {candidateSkills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium border border-blue-200/60"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => navigate('/resume-skills')}
                className="text-blue-600 hover:text-blue-800 font-semibold underline"
              >
                Change Skills
              </button>
            </div>
          )}
        </div>

        {/* Job Cards Grid */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No matching jobs found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search query, clearing filters, or checking back soon for new postings.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedType('All');
                setSelectedExp('All');
              }}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => {
              const existingApp = applications.find((a) => a.jobId === job.id);
              const isApplied = !!existingApp;

              return (
                <JobCard
                  key={job.id}
                  job={job}
                  candidateSkills={candidateSkills}
                  isApplied={isApplied}
                  applicationStatus={existingApp ? existingApp.status : null}
                  onApply={() => handleApply(job)}
                  onViewDetails={() => setSelectedJobForModal(job)}
                  onViewMatchAnalysis={() => navigate(`/match-analysis?jobId=${job.id}`)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Job Details Modal */}
      {selectedJobForModal && (
        <Modal
          isOpen={!!selectedJobForModal}
          onClose={() => setSelectedJobForModal(null)}
          title={selectedJobForModal.title}
          subtitle={`${selectedJobForModal.company} • ${selectedJobForModal.location}`}
          maxWidth="max-w-2xl"
        >
          {(() => {
            const matchInfo = calculateMatch(
              candidateSkills,
              selectedJobForModal.requiredSkills,
              selectedJobForModal.threshold
            );
            const isAlreadyApplied = applications.some((a) => a.jobId === selectedJobForModal.id);

            return (
              <div className="space-y-6">
                {/* Match Analysis Callout */}
                <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Your Skill Compatibility
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
                      {matchInfo.matchScore}% Match
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {matchInfo.matchedCount} of {matchInfo.totalRequired} required skills matched •{' '}
                      {matchInfo.meetsThreshold ? (
                        <span className="text-emerald-700 font-bold">Meets {selectedJobForModal.threshold}% threshold</span>
                      ) : (
                        <span className="text-amber-700 font-medium">Below {selectedJobForModal.threshold}% threshold</span>
                      )}
                    </p>
                  </div>
                  <MatchScoreRing score={matchInfo.matchScore} size="md" />
                </div>

                {/* Job Metadata Highlights */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Job Type</span>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">{selectedJobForModal.type}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Experience</span>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">{selectedJobForModal.experience}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Location</span>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">{selectedJobForModal.location}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Deadline</span>
                    <p className="text-xs font-bold text-slate-800 mt-0.5">{selectedJobForModal.deadline || 'Open'}</p>
                  </div>
                </div>

                {/* Full Description */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Role Description
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-slate-200">
                    {selectedJobForModal.description}
                  </p>
                </div>

                {/* Required Skills vs Candidate Skills Breakdown */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Required Skills Breakdown
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJobForModal.requiredSkills.map((sk, idx) => {
                      const isMatched = matchInfo.matchedSkills.includes(sk);
                      return (
                        <span
                          key={idx}
                          className={`text-xs px-3 py-1.5 rounded-xl font-medium inline-flex items-center gap-1.5 border ${
                            isMatched
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}
                        >
                          {isMatched ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5 text-rose-500" />
                          )}
                          <span>{sk}</span>
                          <span className="text-[10px] opacity-75">
                            ({isMatched ? 'Matched' : 'Missing'})
                          </span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => navigate(`/match-analysis?jobId=${selectedJobForModal.id}`)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    View Comprehensive Gap Analysis →
                  </button>

                  <div className="flex items-center gap-2">
                    {isAlreadyApplied ? (
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                        Already Applied
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleApply(selectedJobForModal)}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm"
                      >
                        Submit Application
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </Modal>
      )}
    </div>
  );
};
