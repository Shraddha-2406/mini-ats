/**
 * Data Service Layer for Mini ATS
 * 
 * Manages prototype persistence in localStorage while adhering to a strict
 * relational schema aligned with MySQL database tables (Users, Skills, User_Skills,
 * Jobs, Job_Skills, Applications).
 * 
 * In Phase 2, these functions can be directly swapped with `fetch('/api/...')`
 * calls to the Flask backend without changing UI component logic.
 */

import { INITIAL_USERS, INITIAL_SKILLS, INITIAL_JOBS, INITIAL_APPLICATIONS } from '../data/initialData';
import { calculateMatch } from './matchingService';

const STORAGE_KEYS = {
  USERS: 'mini_ats_users_v1',
  SKILLS: 'mini_ats_skills_v1',
  JOBS: 'mini_ats_jobs_v1',
  APPLICATIONS: 'mini_ats_applications_v1',
  ACTIVE_USER_ID: 'mini_ats_active_user_id_v1',
};

// Safe JSON parser
const loadStorage = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error loading key "${key}" from localStorage:`, err);
    return fallback;
  }
};

const saveStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving key "${key}" to localStorage:`, err);
  }
};

/**
 * Initialize storage with default data if not already present
 */
export const initializeDataService = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    saveStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SKILLS)) {
    saveStorage(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.JOBS)) {
    saveStorage(STORAGE_KEYS.JOBS, INITIAL_JOBS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
    saveStorage(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ID)) {
    // Default active user is Rahul Sharma (Candidate)
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, 'usr-1');
  }
};

/**
 * Reset all prototype data to initial sample data
 */
export const resetToDefaultData = () => {
  saveStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
  saveStorage(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
  saveStorage(STORAGE_KEYS.JOBS, INITIAL_JOBS);
  saveStorage(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
  localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, 'usr-1');
  return true;
};

/* ==========================================================================
   USERS TABLE OPERATIONS
   ========================================================================== */

export const getUsers = () => {
  return loadStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
};

export const getUserById = (id) => {
  const users = getUsers();
  return users.find((u) => u.id === id) || null;
};

export const getUserByEmail = (email) => {
  const users = getUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
};

export const createUser = (userData) => {
  const users = getUsers();
  const newUser = {
    id: `usr-${Date.now()}`,
    skills: [],
    experienceYears: 0,
    resumeMeta: { isUploaded: false },
    ...userData,
  };
  users.push(newUser);
  saveStorage(STORAGE_KEYS.USERS, users);
  return newUser;
};

export const updateUser = (id, updates) => {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  users[index] = { ...users[index], ...updates };
  saveStorage(STORAGE_KEYS.USERS, users);

  // If candidate skills changed, update all existing applications submitted by this candidate
  if (updates.skills && users[index].role === 'candidate') {
    recalculateCandidateApplications(id, updates.skills);
  }

  return users[index];
};

/* ==========================================================================
   SKILLS TABLE OPERATIONS
   ========================================================================== */

export const getSkills = () => {
  return loadStorage(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
};

export const addCustomSkill = (skillName, category = 'Other') => {
  const skills = getSkills();
  const clean = skillName.trim();
  const exists = skills.some((s) => s.name.toLowerCase() === clean.toLowerCase());
  if (exists) return skills;

  const newSkill = {
    id: `sk-${Date.now()}`,
    name: clean,
    category,
  };
  skills.push(newSkill);
  saveStorage(STORAGE_KEYS.SKILLS, skills);
  return skills;
};

/* ==========================================================================
   JOBS TABLE OPERATIONS
   ========================================================================== */

export const getJobs = () => {
  return loadStorage(STORAGE_KEYS.JOBS, INITIAL_JOBS);
};

export const getJobById = (id) => {
  const jobs = getJobs();
  return jobs.find((j) => j.id === id) || null;
};

export const createJob = (jobData) => {
  const jobs = getJobs();
  const newJob = {
    id: `job-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'Active',
    threshold: 80,
    requiredSkills: [],
    companyLogo: (jobData.company || 'TN').substring(0, 2).toUpperCase(),
    ...jobData,
  };
  jobs.unshift(newJob);
  saveStorage(STORAGE_KEYS.JOBS, jobs);
  return newJob;
};

export const updateJob = (id, updates) => {
  const jobs = getJobs();
  const index = jobs.findIndex((j) => j.id === id);
  if (index === -1) return null;

  jobs[index] = { ...jobs[index], ...updates };
  saveStorage(STORAGE_KEYS.JOBS, jobs);

  // Recalculate applicant scores if requiredSkills or threshold changed
  if (updates.requiredSkills || updates.threshold !== undefined) {
    recalculateJobApplications(id, jobs[index].requiredSkills, jobs[index].threshold);
  }

  return jobs[index];
};

export const deleteJob = (id) => {
  let jobs = getJobs();
  jobs = jobs.filter((j) => j.id !== id);
  saveStorage(STORAGE_KEYS.JOBS, jobs);

  // Optionally clean up applications
  let apps = getApplications();
  apps = apps.filter((a) => a.jobId !== id);
  saveStorage(STORAGE_KEYS.APPLICATIONS, apps);
  return true;
};

/* ==========================================================================
   APPLICATIONS TABLE OPERATIONS
   ========================================================================== */

export const getApplications = (filters = {}) => {
  let apps = loadStorage(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
  if (filters.candidateId) {
    apps = apps.filter((a) => a.candidateId === filters.candidateId);
  }
  if (filters.jobId) {
    apps = apps.filter((a) => a.jobId === filters.jobId);
  }
  if (filters.status && filters.status !== 'All') {
    apps = apps.filter((a) => a.status.toLowerCase() === filters.status.toLowerCase());
  }
  return apps;
};

export const getApplicationById = (id) => {
  const apps = getApplications();
  return apps.find((a) => a.id === id) || null;
};

export const createApplication = (jobId, candidateId) => {
  const apps = getApplications();
  
  // Prevent duplicate applications
  const existing = apps.find((a) => a.jobId === jobId && a.candidateId === candidateId);
  if (existing) {
    return { success: false, message: 'You have already applied for this position.', application: existing };
  }

  const job = getJobById(jobId);
  const candidate = getUserById(candidateId);

  if (!job || !candidate) {
    return { success: false, message: 'Job or candidate not found.' };
  }

  // Calculate real-time match using algorithm service
  const matchResult = calculateMatch(candidate.skills, job.requiredSkills, job.threshold);

  // Automatic shortlisting: if score meets threshold, default status is Shortlisted, else Pending
  const initialStatus = matchResult.meetsThreshold ? 'Shortlisted' : 'Pending';

  const newApp = {
    id: `app-${Date.now()}`,
    jobId,
    candidateId,
    matchScore: matchResult.matchScore,
    matchedSkills: matchResult.matchedSkills,
    missingSkills: matchResult.missingSkills,
    status: initialStatus,
    appliedDate: new Date().toISOString(),
    notes: matchResult.meetsThreshold
      ? `Automatically shortlisted (Skill score ${matchResult.matchScore}% meets threshold ${job.threshold}%).`
      : `Application pending review (Skill score ${matchResult.matchScore}% is below threshold ${job.threshold}%).`,
  };

  apps.unshift(newApp);
  saveStorage(STORAGE_KEYS.APPLICATIONS, apps);
  return { success: true, message: 'Application submitted successfully!', application: newApp };
};

export const updateApplicationStatus = (appId, newStatus, notes = '') => {
  const apps = getApplications();
  const index = apps.findIndex((a) => a.id === appId);
  if (index === -1) return null;

  apps[index].status = newStatus;
  if (notes) {
    apps[index].notes = notes;
  }
  saveStorage(STORAGE_KEYS.APPLICATIONS, apps);
  return apps[index];
};

/**
 * Recomputes match score for a candidate's applications when their skills change
 */
const recalculateCandidateApplications = (candidateId, newSkills) => {
  const apps = getApplications();
  let updated = false;

  apps.forEach((app) => {
    if (app.candidateId === candidateId) {
      const job = getJobById(app.jobId);
      if (job) {
        const match = calculateMatch(newSkills, job.requiredSkills, job.threshold);
        app.matchScore = match.matchScore;
        app.matchedSkills = match.matchedSkills;
        app.missingSkills = match.missingSkills;
        updated = true;
      }
    }
  });

  if (updated) {
    saveStorage(STORAGE_KEYS.APPLICATIONS, apps);
  }
};

/**
 * Recomputes all applications for a job when job requirements or threshold change
 */
const recalculateJobApplications = (jobId, newReqSkills, newThreshold) => {
  const apps = getApplications();
  let updated = false;

  apps.forEach((app) => {
    if (app.jobId === jobId) {
      const candidate = getUserById(app.candidateId);
      if (candidate) {
        const match = calculateMatch(candidate.skills, newReqSkills, newThreshold);
        app.matchScore = match.matchScore;
        app.matchedSkills = match.matchedSkills;
        app.missingSkills = match.missingSkills;
        updated = true;
      }
    }
  });

  if (updated) {
    saveStorage(STORAGE_KEYS.APPLICATIONS, apps);
  }
};

/* ==========================================================================
   RANKING & SCREENING OPERATIONS
   ========================================================================== */

/**
 * Returns ranked applicants for a given job, ordered by matchScore DESC
 */
export const getRankedCandidatesForJob = (jobId) => {
  const job = getJobById(jobId);
  if (!job) return [];

  const apps = getApplications({ jobId });
  const users = getUsers();

  const candidatesWithScore = apps.map((app) => {
    const candidate = users.find((u) => u.id === app.candidateId) || {
      id: app.candidateId,
      name: 'Unknown Candidate',
      email: 'candidate@example.com',
      skills: [],
    };

    // Always recalculate to ensure real-time consistency
    const match = calculateMatch(candidate.skills, job.requiredSkills, job.threshold);

    return {
      applicationId: app.id,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      threshold: job.threshold,
      candidateId: candidate.id,
      candidateName: candidate.name,
      candidateEmail: candidate.email,
      candidatePhone: candidate.phone || '',
      candidateDegree: candidate.degree || '',
      candidateEducation: candidate.education || '',
      candidateExperience: candidate.experienceYears || 0,
      candidateSkills: candidate.skills || [],
      matchedSkills: match.matchedSkills,
      missingSkills: match.missingSkills,
      matchedCount: match.matchedCount,
      totalRequired: match.totalRequired,
      matchScore: match.matchScore,
      meetsThreshold: match.meetsThreshold,
      status: app.status,
      appliedDate: app.appliedDate,
      notes: app.notes,
    };
  });

  // Sort descending by match score, secondary sort by appliedDate
  candidatesWithScore.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    return new Date(b.appliedDate) - new Date(a.appliedDate);
  });

  // Assign ranks
  return candidatesWithScore.map((c, idx) => ({
    ...c,
    rank: idx + 1,
  }));
};

/* ==========================================================================
   DASHBOARD KPI METRICS
   ========================================================================== */

export const getCandidateDashboardMetrics = (candidateId) => {
  const candidate = getUserById(candidateId);
  const allJobs = getJobs().filter((j) => j.status === 'Active');
  const myApps = getApplications({ candidateId });

  const shortlistedApps = myApps.filter((a) => a.status === 'Shortlisted');
  const pendingApps = myApps.filter((a) => a.status === 'Pending');
  const rejectedApps = myApps.filter((a) => a.status === 'Rejected');

  // Calculate profile completion percentage
  // Personal Info (name, email, phone, education): 35%
  // Resume upload: 35%
  // Skills added (at least 3 skills): 30%
  let completion = 0;
  if (candidate) {
    if (candidate.name && candidate.email) completion += 20;
    if (candidate.phone && candidate.education) completion += 15;
    if (candidate.resumeMeta && candidate.resumeMeta.isUploaded) completion += 35;
    if (candidate.skills && candidate.skills.length >= 3) {
      completion += 30;
    } else if (candidate.skills && candidate.skills.length > 0) {
      completion += 15;
    }
  }

  // Recommended jobs based on candidate skills
  const candidateSkills = candidate ? candidate.skills : [];
  const recommendedJobs = allJobs
    .map((job) => {
      const match = calculateMatch(candidateSkills, job.requiredSkills, job.threshold);
      const isApplied = myApps.some((a) => a.jobId === job.id);
      return {
        ...job,
        matchScore: match.matchScore,
        matchedSkills: match.matchedSkills,
        missingSkills: match.missingSkills,
        isApplied,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  return {
    profileCompletion: completion,
    totalAvailableJobs: allJobs.length,
    totalAppliedJobs: myApps.length,
    shortlistedCount: shortlistedApps.length,
    pendingCount: pendingApps.length,
    rejectedCount: rejectedApps.length,
    myApplications: myApps,
    recommendedJobs,
  };
};

export const getRecruiterDashboardMetrics = (recruiterId) => {
  const jobs = getJobs(); // in demo, recruiter manages all demo jobs or techNova jobs
  const activeJobs = jobs.filter((j) => j.status === 'Active');
  const allApps = getApplications();
  const users = getUsers();

  const shortlisted = allApps.filter((a) => a.status === 'Shortlisted');
  const pending = allApps.filter((a) => a.status === 'Pending');
  const rejected = allApps.filter((a) => a.status === 'Rejected');

  // Chart 1: Applications by Job
  const applicationsByJob = jobs.map((job) => {
    const jobApps = allApps.filter((a) => a.jobId === job.id);
    return {
      name: job.title.length > 14 ? job.title.substring(0, 14) + '...' : job.title,
      fullName: job.title,
      applications: jobApps.length,
      shortlisted: jobApps.filter((a) => a.status === 'Shortlisted').length,
    };
  });

  // Chart 2: Match Score Distribution
  let highMatch = 0; // 80-100%
  let moderateMatch = 0; // 50-79%
  let lowMatch = 0; // 0-49%

  allApps.forEach((a) => {
    if (a.matchScore >= 80) highMatch++;
    else if (a.matchScore >= 50) moderateMatch++;
    else lowMatch++;
  });

  const scoreDistribution = [
    { name: '80–100% (High)', count: highMatch, color: '#10b981' },
    { name: '50–79% (Moderate)', count: moderateMatch, color: '#f59e0b' },
    { name: '0–49% (Low)', count: lowMatch, color: '#ef4444' },
  ];

  // Chart 3: Application Status Breakdown
  const statusBreakdown = [
    { name: 'Shortlisted', value: shortlisted.length, color: '#10b981' },
    { name: 'Pending Review', value: pending.length, color: '#f59e0b' },
    { name: 'Rejected', value: rejected.length, color: '#ef4444' },
  ];

  // Chart 4: Activity Trend (Simulated 5 weeks activity)
  const activityTrend = [
    { week: 'Week 1', applications: 2, shortlisted: 1 },
    { week: 'Week 2', applications: 4, shortlisted: 3 },
    { week: 'Week 3', applications: 6, shortlisted: 4 },
    { week: 'Week 4', applications: 8, shortlisted: 6 },
    { week: 'Week 5', applications: allApps.length, shortlisted: shortlisted.length },
  ];

  // Recent Applicants list with enriched names & job titles
  const recentApplicants = allApps.slice(0, 7).map((app) => {
    const candidate = users.find((u) => u.id === app.candidateId);
    const job = jobs.find((j) => j.id === app.jobId);
    return {
      id: app.id,
      candidateId: app.candidateId,
      candidateName: candidate ? candidate.name : 'Unknown Candidate',
      candidateEmail: candidate ? candidate.email : 'N/A',
      jobId: app.jobId,
      jobTitle: job ? job.title : 'Job Posting',
      company: job ? job.company : 'Company',
      matchScore: app.matchScore,
      matchedSkills: app.matchedSkills || [],
      missingSkills: app.missingSkills || [],
      appliedDate: app.appliedDate,
      status: app.status,
    };
  });

  return {
    totalActiveJobs: activeJobs.length,
    totalApplications: allApps.length,
    shortlistedCount: shortlisted.length,
    pendingCount: pending.length,
    rejectedCount: rejected.length,
    applicationsByJob,
    scoreDistribution,
    statusBreakdown,
    activityTrend,
    recentApplicants,
  };
};
