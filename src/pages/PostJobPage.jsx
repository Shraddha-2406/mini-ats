import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  PlusCircle,
  Eye,
  Save,
  CheckCircle2,
  Trash2,
  Sliders,
  MapPin,
  Clock,
  Sparkles,
  Layers,
  Calendar,
  AlertCircle,
  Plus,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getJobs, createJob, updateJob, deleteJob, getSkills, addCustomSkill } from '../services/dataService';
import { Sidebar } from '../components/Sidebar';
import { Modal } from '../components/Modal';
import { SkillChip } from '../components/SkillChip';
import { StatusBadge } from '../components/StatusBadge';

export const PostJobPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('post'); // 'post' | 'manage'

  // Form Fields
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState(currentUser?.company || 'TechNova Solutions');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('Pune, India (Hybrid)');
  const [type, setType] = useState('Full-Time');
  const [experience, setExperience] = useState('1-3 years');
  const [threshold, setThreshold] = useState(80);
  const [deadline, setDeadline] = useState('2026-12-31');
  const [requiredSkills, setRequiredSkills] = useState(['Python', 'SQL', 'Git']);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Manage Jobs State
  const [allJobs, setAllJobs] = useState(getJobs());

  const skillBank = getSkills();

  const toggleSkill = (skillName) => {
    if (requiredSkills.some((s) => s.toLowerCase() === skillName.toLowerCase())) {
      setRequiredSkills(requiredSkills.filter((s) => s.toLowerCase() !== skillName.toLowerCase()));
    } else {
      setRequiredSkills([...requiredSkills, skillName]);
    }
  };

  const handleAddCustomSkill = (e) => {
    e?.preventDefault();
    if (!customSkillInput.trim()) return;
    const clean = customSkillInput.trim();
    addCustomSkill(clean, 'Custom');
    if (!requiredSkills.some((s) => s.toLowerCase() === clean.toLowerCase())) {
      setRequiredSkills([...requiredSkills, clean]);
      toast.success(`Added "${clean}" to job requirements`);
    }
    setCustomSkillInput('');
  };

  // Form Submission
  const handleSubmitJob = (status = 'Active') => {
    if (!title.trim() || !company.trim() || !description.trim()) {
      toast.error('Please fill in Job Title, Company, and Role Description.');
      return;
    }

    if (requiredSkills.length === 0) {
      toast.error('Please select at least one required technical skill.');
      return;
    }

    const newJob = createJob({
      recruiterId: currentUser?.id || 'rec-1',
      title: title.trim(),
      company: company.trim(),
      description: description.trim(),
      location: location.trim(),
      type,
      experience,
      threshold: Number(threshold),
      deadline,
      requiredSkills,
      status,
    });

    if (newJob) {
      toast.success(`Job "${title}" has been successfully ${status === 'Draft' ? 'saved as Draft' : 'published'}!`);
      setAllJobs(getJobs());
      // Reset form or navigate
      setActiveTab('manage');
    }
  };

  // Toggle Job Status (Active vs Closed)
  const handleToggleStatus = (job) => {
    const nextStatus = job.status === 'Active' ? 'Closed' : 'Active';
    updateJob(job.id, { status: nextStatus });
    setAllJobs(getJobs());
    toast.info(`Job "${job.title}" marked as ${nextStatus}.`);
  };

  // Delete Job
  const handleDeleteJob = (jobId) => {
    deleteJob(jobId);
    setAllJobs(getJobs());
    toast.success('Job posting removed.');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex">
      {/* Recruiter Sidebar */}
      <Sidebar role="recruiter" />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 overflow-y-auto">
        {/* Top Header & Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Job Requisition Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Post & Manage Job Openings
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Specify technical skill requirements and configure automatic shortlisting match thresholds.
            </p>
          </div>

          {/* Tab Switcher: Post Job vs Manage Jobs */}
          <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('post')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'post'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Post a New Job
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('manage')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'manage'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Manage Existing Jobs ({allJobs.length})
            </button>
          </div>
        </div>

        {activeTab === 'post' ? (
          /* CREATE JOB FORM */
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-subtle space-y-6">
            <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Create Requisition</h2>
                <p className="text-xs text-slate-500">
                  Published jobs will instantly appear on candidate dashboards and listings
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-blue-600" />
                <span>Preview Job</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Job Title */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Python / Django Developer"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="TechNova Solutions"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              {/* Job Location */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Location *
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Pune, India (Hybrid)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Employment Type *
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                >
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Internship">Internship</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              {/* Minimum Experience */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Experience Requirement *
                </label>
                <select
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                >
                  <option value="0-1 years">0-1 years (Fresher/Entry)</option>
                  <option value="1-3 years">1-3 years (Junior)</option>
                  <option value="2-4 years">2-4 years (Mid-Level)</option>
                  <option value="3-5 years">3-5 years (Senior)</option>
                  <option value="5+ years">5+ years (Lead/Principal)</option>
                </select>
              </div>

              {/* Application Deadline */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Application Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              {/* MATCHING THRESHOLD SLIDER (Critical ATS Feature) */}
              <div className="sm:col-span-2 p-5 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-blue-600" />
                    <label className="text-xs font-bold uppercase tracking-wider text-blue-900">
                      Automatic Shortlisting Threshold:
                    </label>
                  </div>
                  <span className="text-lg font-black text-blue-700 bg-white px-3 py-1 rounded-xl border border-blue-200 shadow-sm">
                    {threshold}%
                  </span>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />

                <div className="flex justify-between text-[10px] text-blue-600 font-semibold">
                  <span>0% (Lenient)</span>
                  <span>50% (Moderate)</span>
                  <span>80% (Recommended Standard)</span>
                  <span>100% (Strict Perfect Match)</span>
                </div>

                <p className="text-xs text-blue-800 leading-relaxed font-medium">
                  "Candidates meeting or exceeding this {threshold}% skill match threshold are
                  eligible for automatic shortlisting."
                </p>
              </div>
            </div>

            {/* Job Description Textarea */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Role Description & Key Responsibilities *
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the candidate expectations, core technologies, software stack, and daily development tasks..."
                className="w-full p-3.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 leading-relaxed"
              />
            </div>

            {/* REQUIRED SKILLS MULTI-SELECT & CUSTOM SKILLS */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Required Technical Skills ({requiredSkills.length} selected) *
                  </label>
                  <p className="text-xs text-slate-500">
                    Click skills from the bank below or add a new custom skill
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomSkill();
                      }
                    }}
                    placeholder="Custom skill tag..."
                    className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSkill}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-semibold text-xs hover:bg-slate-800 transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              {/* Selected skills preview */}
              <div className="flex flex-wrap gap-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                {requiredSkills.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">No skills selected yet</span>
                ) : (
                  requiredSkills.map((sk) => (
                    <SkillChip
                      key={sk}
                      name={sk}
                      onRemove={() => toggleSkill(sk)}
                      size="md"
                    />
                  ))
                )}
              </div>

              {/* Skill bank picker */}
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-3.5 rounded-2xl border border-slate-200">
                {skillBank.map((sk) => {
                  const isSelected = requiredSkills.some(
                    (s) => s.toLowerCase() === sk.name.toLowerCase()
                  );
                  return (
                    <SkillChip
                      key={sk.id}
                      name={sk.name}
                      variant="selectable"
                      isSelected={isSelected}
                      onSelect={() => toggleSkill(sk.name)}
                      size="sm"
                    />
                  );
                })}
              </div>
            </div>

            {/* Buttons Bar */}
            <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setTitle('');
                  setDescription('');
                  setRequiredSkills([]);
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs"
              >
                Clear Form
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSubmitJob('Draft')}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs sm:text-sm"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleSubmitJob('Active')}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow transition-all flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Publish Job</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* MANAGE EXISTING JOBS TABLE */
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-subtle space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Managed Positions</h2>
                <p className="text-xs text-slate-500">
                  Control active status, edit criteria, or inspect applicant volume
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('post')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Post Another Job</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-3">Job Title & Company</th>
                    <th className="py-3 px-3">Type & Experience</th>
                    <th className="py-3 px-3">Threshold</th>
                    <th className="py-3 px-3">Skills Required</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-3">
                        <p className="font-bold text-slate-900">{job.title}</p>
                        <p className="text-[11px] text-slate-400">{job.company} • {job.location}</p>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="font-semibold text-slate-700">{job.type}</span>
                        <p className="text-[11px] text-slate-400">{job.experience}</p>
                      </td>

                      <td className="py-3.5 px-3 font-extrabold text-blue-600">
                        {job.threshold}%
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {job.requiredSkills.slice(0, 3).map((sk, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                            >
                              {sk}
                            </span>
                          ))}
                          {job.requiredSkills.length > 3 && (
                            <span className="text-[10px] text-slate-400">
                              +{job.requiredSkills.length - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <StatusBadge status={job.status} size="sm" />
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(job)}
                            className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700"
                          >
                            {job.status === 'Active' ? 'Close' : 'Reactivate'}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteJob(job.id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                            title="Delete Job"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Job Preview Modal */}
      {showPreviewModal && (
        <Modal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          title={`Job Preview: ${title || 'Job Title'}`}
          subtitle={`${company} • ${location}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 bg-blue-50/60 rounded-2xl border border-blue-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800">
                  Shortlisting Rule
                </span>
                <p className="text-xs text-blue-900 mt-0.5">
                  Candidates meeting <strong>{threshold}%</strong> or more skill match are automatically shortlisted.
                </p>
              </div>
              <span className="text-xl font-black text-blue-700">{threshold}% Min</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-bold block text-[10px]">EMPLOYMENT</span>
                <span className="font-semibold text-slate-800">{type}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-bold block text-[10px]">EXPERIENCE</span>
                <span className="font-semibold text-slate-800">{experience}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 font-bold block text-[10px]">DEADLINE</span>
                <span className="font-semibold text-slate-800">{deadline}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Description
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200">
                {description || 'No description provided yet.'}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Required Technical Skills ({requiredSkills.length})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {requiredSkills.map((sk, idx) => (
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
        </Modal>
      )}
    </div>
  );
};
