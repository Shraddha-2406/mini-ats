import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Briefcase,
  CheckCircle2,
  Clock,
  Award,
  ArrowRight,
  TrendingUp,
  User,
  ExternalLink,
  UploadCloud,
  ChevronRight,
  Sparkles,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getCandidateDashboardMetrics, getJobs } from '../services/dataService';
import { StatCard } from '../components/StatCard';
import { MatchScoreRing } from '../components/MatchScoreRing';
import { StatusBadge } from '../components/StatusBadge';
import { Sidebar } from '../components/Sidebar';
import { ResumePreviewModal } from '../components/ResumePreviewModal';

export const CandidateDashboard = () => {
  const { currentUser, role } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [metrics, setMetrics] = useState(null);
  const [showResumeModal, setShowResumeModal] = useState(false);

  // Load candidate metrics
  useEffect(() => {
    if (currentUser) {
      const data = getCandidateDashboardMetrics(currentUser.id);
      setMetrics(data);
    }
  }, [currentUser]);

  if (!currentUser || !metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Loading candidate dashboard...</p>
        </div>
      </div>
    );
  }

  const candidateFirstName = currentUser.name.split(' ')[0] || 'Candidate';
  const hasResume = currentUser.resumeMeta?.isUploaded;
  const candidateSkills = currentUser.skills || [];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar role="candidate" />

      {/* Main Dashboard Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 overflow-y-auto">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-elevated relative overflow-hidden">
          <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-blue-100 text-xs font-semibold backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                <span>Candidate Portal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                Welcome back, {candidateFirstName}!
              </h1>
              <p className="text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">
                Your skills are currently matched with active engineering openings. Track your
                applications, view missing skill recommendations, and update your resume profile.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap sm:flex-col gap-2.5 flex-shrink-0">
              <Link
                to="/jobs"
                className="px-4 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Briefcase className="w-4 h-4" />
                <span>Browse All Jobs</span>
              </Link>
              <Link
                to="/resume-skills"
                className="px-4 py-2.5 rounded-xl bg-blue-500/30 hover:bg-blue-500/40 text-white border border-white/20 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>Update Resume & Skills</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="Profile Completion"
            value={`${metrics.profileCompletion}%`}
            subtitle={metrics.profileCompletion === 100 ? 'Profile fully completed' : 'Complete profile to maximize score'}
            icon={User}
            color="blue"
            onClick={() => navigate('/resume-skills')}
          />
          <StatCard
            title="Available Jobs"
            value={metrics.totalAvailableJobs}
            subtitle="Open positions matching skills"
            icon={Briefcase}
            color="indigo"
            onClick={() => navigate('/jobs')}
          />
          <StatCard
            title="Applied Jobs"
            value={metrics.totalAppliedJobs}
            subtitle={`${metrics.pendingCount} pending review`}
            icon={FileText}
            color="purple"
          />
          <StatCard
            title="Shortlisted Applications"
            value={metrics.shortlistedCount}
            subtitle="Met job threshold criteria"
            icon={CheckCircle2}
            color="emerald"
            badge="Top Match"
          />
        </div>

        {/* Two-Column Layout: Recommended Jobs vs Profile & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Recommended Jobs (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  Recommended Positions For You
                </h2>
                <p className="text-xs text-slate-500">
                  Calculated using live skill overlap matching against your profile
                </p>
              </div>
              <Link
                to="/jobs"
                className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Recommended Jobs List */}
            <div className="space-y-4">
              {metrics.recommendedJobs.slice(0, 3).map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-subtle hover:shadow-card transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-sm">
                      {job.companyLogo || (job.company || 'TN').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors">
                          {job.title}
                        </h3>
                        {job.matchScore >= job.threshold && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Threshold Met
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 font-medium">
                        {job.company} • {job.location} • {job.type}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mt-2.5">
                        {job.requiredSkills.slice(0, 4).map((sk, idx) => {
                          const isMatched = candidateSkills.some(
                            (s) => s.toLowerCase() === sk.toLowerCase()
                          );
                          return (
                            <span
                              key={idx}
                              className={`text-[11px] px-2 py-0.5 rounded-md font-medium border ${
                                isMatched
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-slate-50 text-slate-500 border-slate-200'
                              }`}
                            >
                              {isMatched ? '✓ ' : ''}
                              {sk}
                            </span>
                          );
                        })}
                        {job.requiredSkills.length > 4 && (
                          <span className="text-[11px] text-slate-400 self-center">
                            +{job.requiredSkills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 gap-3">
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <span className="text-lg font-black text-blue-600 leading-none">
                          {job.matchScore}%
                        </span>
                        <p className="text-[10px] text-slate-400 font-medium">Skill Match</p>
                      </div>
                      <MatchScoreRing score={job.matchScore} size="sm" showLabel={false} />
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/match-analysis?jobId=${job.id}`}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        Analysis
                      </Link>
                      <Link
                        to="/jobs"
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
                      >
                        {job.isApplied ? 'Applied' : 'Apply'}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Application Activity */}
            <div className="pt-4">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-4">
                Your Recent Application Activity
              </h2>
              {metrics.myApplications.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
                  <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-700">No applications submitted yet</p>
                  <p className="text-xs text-slate-500 mt-1 mb-4">
                    Apply to recommended jobs to see your match score and recruitment status here.
                  </p>
                  <Link
                    to="/jobs"
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Explore Job Openings
                  </Link>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-subtle divide-y divide-slate-100">
                  {metrics.myApplications.map((app) => {
                    const job = getJobs().find((j) => j.id === app.jobId) || {
                      title: 'Engineering Role',
                      company: 'Company',
                    };
                    return (
                      <div
                        key={app.id}
                        className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2.5">
                            <h4 className="text-sm font-bold text-slate-900">{job.title}</h4>
                            <span className="text-xs text-slate-500">• {job.company}</span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1">
                            Applied on {new Date(app.appliedDate).toLocaleDateString()} • Match Score: {app.matchScore}%
                          </p>
                          {app.notes && (
                            <p className="text-[11px] text-slate-600 mt-1 bg-slate-50 p-1.5 rounded-lg border border-slate-100 max-w-lg">
                              {app.notes}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <StatusBadge status={app.status} size="md" />
                          <Link
                            to={`/match-analysis?jobId=${app.jobId}`}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            View Match
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Profile Summary & Resume Status (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Profile Completion Circular Widget */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-subtle text-center">
              <h3 className="text-sm font-bold text-slate-900 mb-4">
                Profile Readiness
              </h3>
              <div className="my-2">
                <MatchScoreRing
                  score={metrics.profileCompletion}
                  size="lg"
                  subLabel="Profile Strength"
                />
              </div>

              <div className="space-y-2 mt-5 text-left text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-600">Personal & Academic Details</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-600">Resume PDF Attached</span>
                  {hasResume ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                  )}
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-600">Verified Technical Skills (3+)</span>
                  {candidateSkills.length >= 3 ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                  )}
                </div>
              </div>

              <Link
                to="/resume-skills"
                className="mt-5 w-full py-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100/80 font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Edit Profile & Skills</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Resume File Status Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-subtle">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900">Resume Document</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Session
                </span>
              </div>

              {hasResume ? (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-blue-600 text-white">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {currentUser.resumeMeta.fileName}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {currentUser.resumeMeta.fileSize} • Uploaded in local session
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setShowResumeModal(true)}
                      className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>
                    <Link
                      to="/resume-skills"
                      className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>Replace</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 space-y-3">
                  <UploadCloud className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-xs text-slate-600">No resume attached to this profile.</p>
                  <Link
                    to="/resume-skills"
                    className="inline-block py-2 px-4 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors"
                  >
                    Upload Resume PDF
                  </Link>
                </div>
              )}
            </div>

            {/* Verified Skills Chip Overview */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-subtle">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  Your Skills ({candidateSkills.length})
                </h3>
                <Link
                  to="/resume-skills"
                  className="text-xs text-blue-600 font-semibold hover:underline"
                >
                  Manage
                </Link>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {candidateSkills.map((sk, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-medium"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Resume Document Preview Modal */}
      <ResumePreviewModal
        isOpen={showResumeModal}
        onClose={() => setShowResumeModal(false)}
        candidate={currentUser}
      />
    </div>
  );
};
