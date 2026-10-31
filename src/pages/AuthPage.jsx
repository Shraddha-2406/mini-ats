import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  User,
  Briefcase,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Shield,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const AuthPage = () => {
  const navigate = useNavigate();
  const { login, register, switchUser } = useAuth();
  const toast = useToast();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [role, setRole] = useState('candidate'); // 'candidate' | 'recruiter'
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Login Form
  const [loginEmail, setLoginEmail] = useState('rahul.sharma@example.com');
  const [loginPassword, setLoginPassword] = useState('password123');

  // Register Form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regCompany, setRegCompany] = useState('');
  const [regPhone, setRegPhone] = useState('');

  // Handle Login Submit
  const handleLoginSubmit = (e) => {
    e.preventDefault();

    if (!loginEmail.trim() || !loginPassword.trim()) {
      toast.error('Please enter both email address and password.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginEmail.trim())) {
      toast.error('Please enter a valid email address.');
      return;
    }

    const res = login(loginEmail, loginPassword, role);
    if (!res.success) {
      toast.error(res.message);
    } else {
      toast.success(`Welcome back, ${res.user.name}!`);
      if (res.user.role === 'recruiter') {
        navigate('/recruiter');
      } else {
        navigate('/candidate');
      }
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = (e) => {
    e.preventDefault();

    if (!regName.trim() || !regEmail.trim() || !regPassword.trim() || !regConfirmPassword.trim()) {
      toast.error('Please fill in all required registration fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(regEmail.trim())) {
      toast.error('Please enter a valid email format.');
      return;
    }

    if (regPassword.length < 6) {
      toast.error('Password must contain at least 6 characters.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      toast.error('Passwords do not match. Please re-enter.');
      return;
    }

    const res = register({
      name: regName.trim(),
      email: regEmail.trim(),
      password: regPassword,
      role,
      phone: regPhone.trim(),
      company: role === 'recruiter' ? (regCompany.trim() || 'TechNova Solutions') : '',
    });

    if (!res.success) {
      toast.error(res.message);
    } else {
      toast.success(`Account registered successfully as ${role}!`);
      if (role === 'recruiter') {
        navigate('/recruiter');
      } else {
        navigate('/resume-skills');
      }
    }
  };

  // Quick 1-click Demo Account Logins
  const handleQuickLogin = (email, pwd, accountRole, accountId) => {
    setRole(accountRole);
    setLoginEmail(email);
    setLoginPassword(pwd);
    const user = switchUser(accountId);
    if (user) {
      toast.success(`Demo session activated for ${user.name} (${user.role})`);
      if (user.role === 'recruiter') {
        navigate('/recruiter');
      } else {
        navigate('/candidate');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-elevated border border-slate-200/90 overflow-hidden">
        {/* Left Side: Branding & Visuals */}
        <div className="lg:col-span-5 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Subtle geometric circles */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight">Mini ATS</span>
                <p className="text-[11px] text-blue-200">Engineering Mini Project Demo</p>
              </div>
            </div>

            <div className="pt-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                Intelligent Resume Screening & Candidate Ranking
              </h2>
              <p className="text-xs sm:text-sm text-blue-100/90 mt-3 leading-relaxed">
                Experience a complete recruitment lifecycle prototype with deterministic skill matching,
                shortlisting thresholds, and localStorage persistence.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="pt-4 space-y-3 text-xs text-blue-100">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                <span>Deterministic Skill Match Algorithm</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                <span>Automated Candidate Shortlisting Thresholds</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 flex-shrink-0" />
                <span>Structured for Phase 2 Python Flask + MySQL</span>
              </div>
            </div>
          </div>

          {/* Demo Credentials Quick-Launch Cards */}
          <div className="relative z-10 mt-8 pt-6 border-t border-white/20 space-y-2.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-blue-200">
              One-Click Demo Accounts:
            </p>
            <button
              type="button"
              onClick={() =>
                handleQuickLogin('rahul.sharma@example.com', 'password123', 'candidate', 'usr-1')
              }
              className="w-full text-left p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/15 text-xs flex items-center justify-between"
            >
              <div>
                <p className="font-bold text-white">Rahul Sharma (Candidate)</p>
                <p className="text-[10px] text-blue-200">Python, SQL, Django, Git (80% match)</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-blue-200" />
            </button>

            <button
              type="button"
              onClick={() =>
                handleQuickLogin('priya.patil@example.com', 'password123', 'candidate', 'usr-2')
              }
              className="w-full text-left p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/15 text-xs flex items-center justify-between"
            >
              <div>
                <p className="font-bold text-white">Priya Patil (Candidate)</p>
                <p className="text-[10px] text-blue-200">Python, SQL, Machine Learning, Data</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-blue-200" />
            </button>

            <button
              type="button"
              onClick={() =>
                handleQuickLogin('recruiter@technova.com', 'password123', 'recruiter', 'rec-1')
              }
              className="w-full text-left p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all border border-white/15 text-xs flex items-center justify-between"
            >
              <div>
                <p className="font-bold text-white">Admin Recruiter (TechNova)</p>
                <p className="text-[10px] text-blue-200">Full Access to Screening, Rankings & Jobs</p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-blue-200" />
            </button>
          </div>
        </div>

        {/* Right Side: Form (Login / Register) */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between">
          <div>
            {/* Top Tabs: Login vs Register */}
            <div className="flex border-b border-slate-200 mb-6">
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-all ${
                  mode === 'login'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-all ${
                  mode === 'register'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Role Selector: Candidate vs Recruiter */}
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setRole('candidate');
                    if (mode === 'login') setLoginEmail('rahul.sharma@example.com');
                  }}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    role === 'candidate'
                      ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      role === 'candidate' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-tight">Candidate</p>
                    <p className="text-[10px] text-slate-500">Apply & Match Skills</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRole('recruiter');
                    if (mode === 'login') setLoginEmail('recruiter@technova.com');
                  }}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                    role === 'recruiter'
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-sm'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      role === 'recruiter' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold leading-tight">Recruiter</p>
                    <p className="text-[10px] text-slate-500">Post & Screen Resumes</p>
                  </div>
                </button>
              </div>
            </div>

            {/* LOGIN FORM */}
            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Remember this session</span>
                  </label>
                  <span className="text-slate-400 cursor-not-allowed">Demo: password123</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-4"
                >
                  <span>Sign In as {role === 'recruiter' ? 'Recruiter' : 'Candidate'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* REGISTRATION FORM */
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Aniket Verma"
                      required
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="aniket@example.com"
                      required
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                </div>

                {role === 'recruiter' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Company Name *
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        value={regCompany}
                        onChange={(e) => setRegCompany(e.target.value)}
                        placeholder="e.g. Apex Global Tech"
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="Min. 6 chars"
                        required
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="Repeat password"
                        required
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-4"
                >
                  <span>Create {role === 'recruiter' ? 'Recruiter' : 'Candidate'} Account</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>

          {/* Prototype Disclosure Note */}
          <div className="mt-8 pt-4 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400">
              Demo Authentication Notice: Credentials are stored locally in browser session storage for
              demonstration only. Production security will be established with Python Flask in Phase 2.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
