import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  Award,
  Users,
  Search,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Briefcase,
  Zap,
  Layers,
  Sparkles,
  BarChart3,
  Cpu,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MatchScoreRing } from '../components/MatchScoreRing';

export const HomePage = () => {
  const navigate = useNavigate();
  const { switchUser } = useAuth();

  const handleDemoCandidate = () => {
    switchUser('usr-1'); // Rahul Sharma
    navigate('/candidate');
  };

  const handleDemoRecruiter = () => {
    switchUser('rec-1'); // Admin Recruiter
    navigate('/recruiter');
  };

  const features = [
    {
      icon: FileText,
      title: 'Resume Management',
      description: 'Upload PDF resumes with local session verification, contact info tracking, and academic portfolio details.',
      color: 'blue',
    },
    {
      icon: Zap,
      title: 'Smart Skill Matching',
      description: 'Deterministic percentage matching comparing candidate skills against required job skill sets with instant feedback.',
      color: 'indigo',
    },
    {
      icon: Award,
      title: 'Candidate Ranking',
      description: 'Automatically orders applicants by match score in descending order, identifying top talent at a glance.',
      color: 'emerald',
    },
    {
      icon: ShieldCheck,
      title: 'Automatic Shortlisting',
      description: 'Configurable job threshold slider (e.g., 80%) instantly qualifies matching candidates into the shortlist queue.',
      color: 'amber',
    },
    {
      icon: Cpu,
      title: 'Missing Skills Analysis',
      description: 'Identifies skill gaps and provides rule-based recommendations on exactly what skills candidates need to acquire.',
      color: 'purple',
    },
    {
      icon: TrendingUp,
      title: 'Application Tracking',
      description: 'End-to-end recruitment lifecycle from job post to application review, status updates, and dashboard analytics.',
      color: 'blue',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Profile',
      desc: 'Set up your candidate account with education, contact details, and experience credentials.',
    },
    {
      number: '02',
      title: 'Add Skills & Resume',
      desc: 'Upload your PDF resume and select verified technical skills from our comprehensive skill bank.',
    },
    {
      number: '03',
      title: 'Apply for Jobs',
      desc: 'Explore curated job listings with live match previews and submit one-click applications.',
    },
    {
      number: '04',
      title: 'Calculate Match Score',
      desc: 'Our matching engine evaluates skill overlap against job requirements in real time.',
    },
    {
      number: '05',
      title: 'View Results',
      desc: 'Track shortlist status, explore missing skill analyses, and receive tailored skill recommendations.',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-blue-50/50 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 border border-blue-200 text-blue-800 text-xs font-semibold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Phase 1 Frontend Prototype • Engineering DBMS Mini Project</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                Smarter Resume Screening.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  Better Hiring Decisions.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                An intelligent recruitment platform that matches candidate skills with job
                requirements, ranks applicants, and simplifies the hiring process.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  type="button"
                  onClick={handleDemoCandidate}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Get Started as Candidate</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  type="button"
                  onClick={handleDemoRecruiter}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
                >
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  <span>Continue as Recruiter</span>
                </button>
              </div>

              {/* Quick Demo Switcher pill bar */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">Quick Test Accounts:</span>
                <button
                  onClick={() => { switchUser('usr-1'); navigate('/candidate'); }}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-blue-600 font-medium hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
                >
                  Rahul (Python 80%)
                </button>
                <button
                  onClick={() => { switchUser('usr-2'); navigate('/candidate'); }}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-indigo-600 font-medium hover:border-indigo-300 hover:bg-indigo-50/50 transition-colors"
                >
                  Priya (ML 75%)
                </button>
                <button
                  onClick={() => { switchUser('rec-1'); navigate('/recruiter'); }}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-emerald-600 font-medium hover:border-emerald-300 hover:bg-emerald-50/50 transition-colors"
                >
                  Admin Recruiter
                </button>
              </div>
            </div>

            {/* Right Interactive Dashboard Preview Illustration */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Glow backdrop */}
                <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-20 blur-xl" />

                {/* Main Mockup Card */}
                <div className="relative bg-white rounded-3xl p-6 shadow-elevated border border-slate-200/80 space-y-5">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                        TN
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Python Developer</h4>
                        <p className="text-[10px] text-slate-500">TechNova Solutions • Threshold: 80%</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Active Job
                    </span>
                  </div>

                  {/* Circular Match Gauge Demonstration */}
                  <div className="bg-slate-50/70 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Top Candidate Match
                      </p>
                      <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">Rahul Sharma</h4>
                      <p className="text-xs text-slate-500">4 of 5 Required Skills Matched</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                          Python ✓
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                          Django ✓
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                          SQL ✓
                        </span>
                      </div>
                    </div>
                    <MatchScoreRing score={80} size="md" />
                  </div>

                  {/* Mini Ranked Applicants Table */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Live Candidate Ranking
                    </p>
                    <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden bg-white text-xs">
                      <div className="p-2.5 flex items-center justify-between hover:bg-slate-50">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-extrabold text-[10px] flex items-center justify-center">
                            1
                          </span>
                          <span className="font-bold text-slate-900">Rahul Sharma</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-emerald-600">80%</span>
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                            Shortlisted
                          </span>
                        </div>
                      </div>
                      <div className="p-2.5 flex items-center justify-between hover:bg-slate-50">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-extrabold text-[10px] flex items-center justify-center">
                            2
                          </span>
                          <span className="font-bold text-slate-900">Rohan Joshi</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-emerald-600">80%</span>
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-semibold">
                            Shortlisted
                          </span>
                        </div>
                      </div>
                      <div className="p-2.5 flex items-center justify-between hover:bg-slate-50">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-extrabold text-[10px] flex items-center justify-center">
                            3
                          </span>
                          <span className="font-bold text-slate-900">Priya Patil</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-rose-600">40%</span>
                          <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                            Pending
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-center">
                    <Link
                      to="/screening"
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1"
                    >
                      Explore Screening & Ranking System
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
              Platform Features
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Comprehensive Tools for Candidates & Recruiters
            </h3>
            <p className="text-sm sm:text-base text-slate-600 mt-3">
              Engineered to eliminate resume screening friction with automated scoring,
              gap analysis, and transparent recruitment workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-50/70 rounded-2xl p-6 border border-slate-200/80 hover:border-blue-300 hover:bg-white hover:shadow-card transition-all duration-200 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/90 text-blue-600 flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
              Workflow
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How the Mini ATS Platform Works
            </h3>
            <p className="text-sm sm:text-base text-slate-600 mt-3">
              A 5-step transparent evaluation pipeline from profile creation to candidate shortlisting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle flex flex-col justify-between relative group hover:border-blue-300 transition-all"
              >
                <div>
                  <span className="text-3xl font-black text-blue-600/30 group-hover:text-blue-600 transition-colors">
                    {s.number}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-2 mb-1.5">{s.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-[11px] font-bold text-blue-600">
                  Step {idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Ready to test the Mini ATS Demonstration?
          </h2>
          <p className="text-base sm:text-lg text-blue-100 max-w-2xl mx-auto">
            Experience the complete candidate and recruiter flows with real sample data,
            automatic shortlisting, and Recharts analytics.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/auth"
              className="px-6 py-3.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 font-bold text-sm shadow-md transition-all"
            >
              Log In or Register
            </Link>
            <Link
              to="/jobs"
              className="px-6 py-3.5 rounded-xl bg-blue-500/30 hover:bg-blue-500/40 text-white border border-white/20 font-bold text-sm transition-all"
            >
              Explore Job Listings
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                ATS
              </div>
              <span className="text-base font-black text-slate-900">Mini ATS</span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Resume Screening System designed for Third-Year Engineering DBMS Mini Project.
              Demonstrates skill matching, applicant ranking, and future MySQL relational database readiness.
            </p>
            <p className="text-[11px] text-slate-400">
              © 2026 Mini ATS. Phase 1 Frontend Prototype.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 uppercase tracking-wider mb-3">Quick Navigation</h5>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
              <li><Link to="/jobs" className="hover:text-blue-600">Browse Jobs</Link></li>
              <li><Link to="/candidate" className="hover:text-blue-600">Candidate Dashboard</Link></li>
              <li><Link to="/recruiter" className="hover:text-blue-600">Recruiter Dashboard</Link></li>
              <li><Link to="/screening" className="hover:text-blue-600">Screening & Ranking</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-slate-900 uppercase tracking-wider mb-3">DBMS Alignment</h5>
            <ul className="space-y-1.5 text-slate-500">
              <li>• Table 1: Users</li>
              <li>• Table 2: Skills</li>
              <li>• Table 3: User_Skills</li>
              <li>• Table 4: Jobs</li>
              <li>• Table 5: Job_Skills</li>
              <li>• Table 6: Applications</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
};
