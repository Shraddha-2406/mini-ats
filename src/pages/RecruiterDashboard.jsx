import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Users,
  CheckCircle2,
  Clock,
  PlusCircle,
  Filter,
  Award,
  ArrowRight,
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  ChevronRight,
  Eye,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  getRecruiterDashboardMetrics,
  updateApplicationStatus,
} from '../services/dataService';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { Sidebar } from '../components/Sidebar';
import { Modal } from '../components/Modal';

export const RecruiterDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [metrics, setMetrics] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  // Load recruiter metrics
  const loadMetrics = () => {
    if (currentUser) {
      const data = getRecruiterDashboardMetrics(currentUser.id);
      setMetrics(data);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, [currentUser]);

  // Handle Quick Status Change from Dashboard Table
  const handleQuickStatusChange = (appId, newStatus) => {
    const updated = updateApplicationStatus(appId, newStatus);
    if (updated) {
      toast.success(`Applicant status updated to ${newStatus}`);
      loadMetrics();
      if (selectedApplicant && selectedApplicant.id === appId) {
        setSelectedApplicant({ ...selectedApplicant, status: newStatus });
      }
    }
  };

  if (!metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium">Loading recruiter dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar role="recruiter" />

      {/* Main Dashboard Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 overflow-y-auto">
        {/* Top Header & Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Talent Acquisition Hub • {currentUser?.company || 'TechNova Solutions'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Recruiter ATS Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Review applicant pools, monitor skill matching metrics, and manage shortlists.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/post-job"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Job</span>
            </Link>
            <Link
              to="/screening"
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-xs sm:text-sm shadow-subtle transition-all flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Screen Candidates</span>
            </Link>
          </div>
        </div>

        {/* 4 KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="Active Job Postings"
            value={metrics.totalActiveJobs}
            subtitle="Published & accepting applications"
            icon={Briefcase}
            color="blue"
            onClick={() => navigate('/jobs')}
          />
          <StatCard
            title="Total Applications"
            value={metrics.totalApplications}
            subtitle="Across all active engineering roles"
            icon={Users}
            color="indigo"
            onClick={() => navigate('/screening')}
          />
          <StatCard
            title="Shortlisted Candidates"
            value={metrics.shortlistedCount}
            subtitle="Exceeded job match threshold"
            icon={CheckCircle2}
            color="emerald"
            badge="Top Talent"
            onClick={() => navigate('/screening?status=Shortlisted')}
          />
          <StatCard
            title="Pending Reviews"
            value={metrics.pendingCount}
            subtitle="Awaiting recruiter manual decision"
            icon={Clock}
            color="amber"
            onClick={() => navigate('/screening?status=Pending')}
          />
        </div>

        {/* Charts Row: Applications by Job & Match Score Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart 1: Applications by Job (8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-subtle">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Applications Received by Job
                </h3>
                <p className="text-xs text-slate-500">
                  Total applications vs shortlisted candidates per position
                </p>
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                Recharts Visual
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metrics.applicationsByJob}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Bar dataKey="applications" name="Total Applied" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="shortlisted" name="Shortlisted" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Match Score Distribution (4 Cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-subtle flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-slate-900">Score Distribution</h3>
                <Award className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Candidate breakdown by skill match category
              </p>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={metrics.scoreDistribution}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                    >
                      {metrics.scoreDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                        border: 'none',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Custom Legend */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              {metrics.scoreDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-600 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts Row 2: Status Breakdown & Application Activity Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chart 3: Application Status Breakdown (4 Cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-subtle flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-bold text-slate-900">Application Status</h3>
                <PieIcon className="w-4 h-4 text-slate-400" />
              </div>
              <p className="text-xs text-slate-500 mb-4">
                Shortlisted vs Pending vs Rejected applications
              </p>

              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={metrics.statusBreakdown}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={65}
                    >
                      {metrics.statusBreakdown.map((entry, index) => (
                        <Cell key={`cell-status-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                        border: 'none',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              {metrics.statusBreakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-slate-600 font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chart 4: Activity Trend (8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-subtle">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Recruitment Activity Trend</h3>
                <p className="text-xs text-slate-500">
                  Application submission trajectory over recent sprint cycles
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                Active Trajectory
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={metrics.activityTrend}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorShort" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="week"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    name="Applications Received"
                    stroke="#2563eb"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorApps)"
                  />
                  <Area
                    type="monotone"
                    dataKey="shortlisted"
                    name="Shortlisted Candidates"
                    stroke="#059669"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorShort)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Applicants Table Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-subtle space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Recent Applicants</h3>
              <p className="text-xs text-slate-500">
                Latest submissions across all posted positions with live match scores
              </p>
            </div>
            <Link
              to="/screening"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1"
            >
              Go to Candidate Screening & Ranking →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">Candidate</th>
                  <th className="py-3 px-3">Applied Role</th>
                  <th className="py-3 px-3">Skills Matched</th>
                  <th className="py-3 px-3">Match Score</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {metrics.recentApplicants.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                          {app.candidateName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{app.candidateName}</p>
                          <p className="text-[11px] text-slate-400">{app.candidateEmail}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <p className="font-semibold text-slate-800">{app.jobTitle}</p>
                      <p className="text-[11px] text-slate-400">{app.company}</p>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {app.matchedSkills.slice(0, 3).map((sk, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded font-medium border border-emerald-200"
                          >
                            {sk}
                          </span>
                        ))}
                        {app.matchedSkills.length > 3 && (
                          <span className="text-[10px] text-slate-400">
                            +{app.matchedSkills.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full ${
                              app.matchScore >= 80
                                ? 'bg-emerald-500'
                                : app.matchScore >= 50
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${app.matchScore}%` }}
                          />
                        </div>
                        <span className="font-extrabold text-slate-900 text-xs">
                          {app.matchScore}%
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <StatusBadge status={app.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedApplicant(app)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          title="View Candidate Application Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickStatusChange(app.id, 'Shortlisted')}
                          className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                          title="Shortlist Candidate"
                        >
                          <Check className="w-4 h-4 stroke-[2.5]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickStatusChange(app.id, 'Rejected')}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Reject Candidate"
                        >
                          <X className="w-4 h-4 stroke-[2.5]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Applicant Detail Quick Modal */}
      {selectedApplicant && (
        <Modal
          isOpen={!!selectedApplicant}
          onClose={() => setSelectedApplicant(null)}
          title={`Applicant: ${selectedApplicant.candidateName}`}
          subtitle={`Application for ${selectedApplicant.jobTitle}`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <p className="text-xs text-slate-500">Calculated Match Score</p>
                <h4 className="text-2xl font-black text-slate-900">
                  {selectedApplicant.matchScore}%
                </h4>
              </div>
              <StatusBadge status={selectedApplicant.status} size="lg" />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Matched Skills ({selectedApplicant.matchedSkills.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selectedApplicant.matchedSkills.map((sk, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold"
                  >
                    ✓ {sk}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Missing Skills ({selectedApplicant.missingSkills.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selectedApplicant.missingSkills.length === 0 ? (
                  <span className="text-xs text-slate-500 italic">None - Complete match!</span>
                ) : (
                  selectedApplicant.missingSkills.map((sk, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 font-semibold"
                    >
                      ✗ {sk}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Update Recruitment Status:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickStatusChange(selectedApplicant.id, 'Shortlisted')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700"
                >
                  Shortlist
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickStatusChange(selectedApplicant.id, 'Pending')}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-semibold hover:bg-amber-600"
                >
                  Mark Pending
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickStatusChange(selectedApplicant.id, 'Rejected')}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700"
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
