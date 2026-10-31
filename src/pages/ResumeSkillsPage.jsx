import React, { useState, useEffect } from 'react';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Trash2,
  Plus,
  Search,
  Eye,
  User,
  GraduationCap,
  Briefcase,
  AlertCircle,
  Save,
  Check,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getSkills, addCustomSkill } from '../services/dataService';
import { SkillChip } from '../components/SkillChip';
import { MatchScoreRing } from '../components/MatchScoreRing';
import { ResumePreviewModal } from '../components/ResumePreviewModal';
import { Sidebar } from '../components/Sidebar';

export const ResumeSkillsPage = () => {
  const { currentUser, updateProfile } = useAuth();
  const toast = useToast();

  // Form State: Personal Info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [education, setEducation] = useState('');
  const [degree, setDegree] = useState('');
  const [gradYear, setGradYear] = useState('');
  const [experienceYears, setExperienceYears] = useState(1);
  const [headline, setHeadline] = useState('');

  // Skills State
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [searchSkillQuery, setSearchSkillQuery] = useState('');
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Resume Upload State
  const [resumeMeta, setResumeMeta] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Load current candidate data
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      setLocation(currentUser.location || '');
      setEducation(currentUser.education || '');
      setDegree(currentUser.degree || '');
      setGradYear(currentUser.gradYear || '2025');
      setExperienceYears(currentUser.experienceYears || 0);
      setHeadline(currentUser.headline || '');
      setSelectedSkills(currentUser.skills || []);
      setResumeMeta(currentUser.resumeMeta || { isUploaded: false });
    }
  }, [currentUser]);

  const allSkills = getSkills();
  const categories = ['All', 'Languages', 'Frontend', 'Backend', 'Databases', 'AI & Data', 'Tools'];

  // Filter skills by search query and category
  const filteredSkills = allSkills.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchSkillQuery.toLowerCase().trim());
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate dynamic profile completion percentage
  const calculateCompletion = () => {
    let score = 0;
    if (name.trim() && email.trim()) score += 20;
    if (phone.trim() && education.trim() && degree.trim()) score += 20;
    if (resumeMeta?.isUploaded) score += 30;
    if (selectedSkills.length >= 3) score += 30;
    else if (selectedSkills.length > 0) score += 15;
    return score;
  };

  const profileScore = calculateCompletion();

  // Handle Skill Toggle
  const toggleSkill = (skillName) => {
    if (selectedSkills.some((s) => s.toLowerCase() === skillName.toLowerCase())) {
      setSelectedSkills(selectedSkills.filter((s) => s.toLowerCase() !== skillName.toLowerCase()));
    } else {
      setSelectedSkills([...selectedSkills, skillName]);
    }
  };

  // Handle Add Custom Skill
  const handleAddCustomSkill = (e) => {
    e?.preventDefault();
    if (!customSkillInput.trim()) return;

    const trimmed = customSkillInput.trim();
    addCustomSkill(trimmed, 'Custom');

    if (!selectedSkills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setSelectedSkills([...selectedSkills, trimmed]);
      toast.success(`Skill "${trimmed}" added to profile!`);
    }
    setCustomSkillInput('');
  };

  // Handle Resume File Selection / Drag-and-Drop
  const handleFileUpload = (file) => {
    if (!file) return;

    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      toast.error('Only PDF documents are supported for resume upload.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds the 5MB limit.');
      return;
    }

    // Trigger simulated smooth upload animation
    setIsUploading(true);
    setUploadProgress(10);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(100);

            const newMeta = {
              fileName: file.name,
              fileSize: `${Math.round(file.size / 1024)} KB`,
              uploadedAt: new Date().toISOString(),
              isUploaded: true,
            };
            setResumeMeta(newMeta);
            toast.success(`Resume "${file.name}" uploaded to session!`);
          }, 400);
          return 95;
        }
        return prev + 25;
      });
    }, 150);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveResume = () => {
    setResumeMeta({ isUploaded: false });
    toast.info('Resume document removed from profile.');
  };

  // Save all profile and skill modifications
  const handleSaveProfile = (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error('Name and email are required fields.');
      return;
    }

    const updated = updateProfile({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      location: location.trim(),
      education: education.trim(),
      degree: degree.trim(),
      gradYear,
      experienceYears: Number(experienceYears),
      headline: headline.trim(),
      skills: selectedSkills,
      resumeMeta,
    });

    if (updated) {
      toast.success('Candidate profile, resume, and skills saved successfully!');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar role="candidate" />

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 overflow-y-auto">
        {/* Page Top Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Resume Upload & Technical Skills
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Manage your personal credentials, upload your PDF resume, and select your verified skills.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-subtle flex items-center gap-2.5">
              <span className="text-xs font-bold text-slate-700">Profile Readiness:</span>
              <span className="text-xs font-black text-blue-600">{profileScore}%</span>
            </div>
            <button
              type="button"
              onClick={handleSaveProfile}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-8">
          {/* SECTION A: Personal Information */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-subtle space-y-6">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Section A: Personal & Academic Credentials
                </h2>
                <p className="text-xs text-slate-500">
                  Essential identification fields used when applying for recruiter job posts
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rahul.sharma@example.com"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Location (City, State)
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Pune, Maharashtra"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  University / College Name
                </label>
                <input
                  type="text"
                  value={education}
                  onChange={(e) => setEducation(e.target.value)}
                  placeholder="e.g. Pune Institute of Computer Technology"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Degree & Specialization
                </label>
                <input
                  type="text"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  placeholder="e.g. B.E. Computer Engineering"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Graduation Year
                </label>
                <select
                  value={gradYear}
                  onChange={(e) => setGradYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                >
                  <option value="2027">2027</option>
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Years of Experience
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Professional Headline
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Aspiring Backend Python Developer"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>
          </section>

          {/* SECTION B: Resume Upload */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-subtle space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Section B: Resume Document Upload
                  </h2>
                  <p className="text-xs text-slate-500">
                    Upload your PDF curriculum vitae for browser session evaluation
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Local Prototype Session
              </span>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-200 ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/50 scale-[0.99]'
                  : 'border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-white'
              }`}
            >
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 mx-auto flex items-center justify-center shadow-sm">
                  <UploadCloud className="w-7 h-7" />
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Drag & drop your resume PDF here
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Supports standard PDF format up to 5 MB
                  </p>
                </div>

                {/* Upload Button */}
                <div>
                  <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm cursor-pointer shadow-sm transition-all">
                    <span>Browse Files</span>
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Progress Animation Bar */}
                {isUploading && (
                  <div className="pt-2 max-w-xs mx-auto">
                    <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                      <span>Uploading document...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-2 transition-all duration-200 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Uploaded Resume Card / Status */}
            {resumeMeta?.isUploaded && (
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-emerald-600 text-white shadow-sm flex-shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">
                        {resumeMeta.fileName}
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        Verified
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {resumeMeta.fileSize} • Uploaded in local session on{' '}
                      {new Date(resumeMeta.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPreviewModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-600" />
                    <span>Preview Document</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveResume}
                    className="px-3 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold text-xs transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            )}

            {/* Prototype Disclaimer */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Phase 1 Transparency Notice:</strong> For this prototype, your resume file
                metadata is maintained in local browser session storage. Automated AI resume text extraction
                is intentionally not simulated here; candidates manually select and verify their skills in
                Section C below for deterministic scoring.
              </p>
            </div>
          </section>

          {/* SECTION C: Technical Skills */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-subtle space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Section C: Technical Skills Selection ({selectedSkills.length} Selected)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Pick your verified programming languages, frameworks, and databases from the bank
                  </p>
                </div>
              </div>

              {/* Add Custom Skill Field */}
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
                  placeholder="Add custom skill..."
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

            {/* Currently Selected Skills Chips */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                Your Active Profile Skills:
              </p>
              {selectedSkills.length === 0 ? (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 italic">
                  No skills selected yet. Click any skill chip below to add it to your candidate profile.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 p-4 bg-slate-50/70 rounded-2xl border border-slate-200/80">
                  {selectedSkills.map((sk) => (
                    <SkillChip
                      key={sk}
                      name={sk}
                      onRemove={() => toggleSkill(sk)}
                      size="md"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Search and Category Filters */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchSkillQuery}
                    onChange={(e) => setSearchSkillQuery(e.target.value)}
                    placeholder="Search technical skills (e.g. Python, React, SQL)..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                  {searchSkillQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchSkillQuery('')}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                        selectedCategory === cat
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skill Bank Chips */}
              <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto p-4 rounded-2xl border border-slate-200 bg-white">
                {filteredSkills.map((sk) => {
                  const isSelected = selectedSkills.some(
                    (s) => s.toLowerCase() === sk.name.toLowerCase()
                  );
                  return (
                    <SkillChip
                      key={sk.id}
                      name={sk.name}
                      variant="selectable"
                      isSelected={isSelected}
                      onSelect={() => toggleSkill(sk.name)}
                      size="md"
                    />
                  );
                })}
              </div>
            </div>
          </section>

          {/* Form Bottom Save Bar */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile & Skills</span>
            </button>
          </div>
        </form>
      </main>

      {/* Resume Document Preview Modal */}
      <ResumePreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        candidate={{
          name,
          email,
          phone,
          location,
          education,
          degree,
          gradYear,
          experienceYears,
          headline,
          skills: selectedSkills,
          resumeMeta,
        }}
      />
    </div>
  );
};
