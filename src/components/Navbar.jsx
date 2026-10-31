import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FileText,
  User,
  LogOut,
  Bell,
  RotateCcw,
  Menu,
  X,
  ChevronDown,
  Briefcase,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { resetToDefaultData, getUsers } from '../services/dataService';
import { ConfirmModal } from './ConfirmModal';

export const Navbar = () => {
  const { currentUser, role, logout, switchUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [demoSwitchOpen, setDemoSwitchOpen] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const allUsers = getUsers();
  const candidates = allUsers.filter((u) => u.role === 'candidate');
  const recruiters = allUsers.filter((u) => u.role === 'recruiter');

  const notifications = [
    {
      id: 1,
      title: 'Application Shortlisted',
      message: 'Your application for Python Developer met the 80% threshold.',
      time: '10m ago',
      unread: true,
    },
    {
      id: 2,
      title: 'New Candidate Applied',
      message: 'Priya Patil applied for Machine Learning Intern.',
      time: '1h ago',
      unread: true,
    },
    {
      id: 3,
      title: 'Profile Skill Updated',
      message: 'Your skills were successfully saved and scores recalculated.',
      time: '2h ago',
      unread: false,
    },
  ];

  const handleResetData = () => {
    resetToDefaultData();
    toast.success('All demo data and applications reset to initial state!');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleSwitchUser = (userId) => {
    const user = switchUser(userId);
    setDemoSwitchOpen(false);
    if (user) {
      toast.info(`Switched active demo user to ${user.name} (${user.role})`);
      if (user.role === 'recruiter') {
        navigate('/recruiter');
      } else {
        navigate('/candidate');
      }
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-black tracking-tight text-slate-900">
                      Mini<span className="text-blue-600">ATS</span>
                    </span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/60">
                      Demo
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-medium hidden sm:block -mt-0.5">
                    Smart Resume Screening
                  </p>
                </div>
              </Link>

              {/* Navigation Links for Desktop */}
              <div className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
                <Link
                  to="/"
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    location.pathname === '/'
                      ? 'text-blue-600 font-semibold bg-blue-50/60'
                      : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/jobs"
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    location.pathname === '/jobs'
                      ? 'text-blue-600 font-semibold bg-blue-50/60'
                      : 'hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Browse Jobs
                </Link>
                {role === 'candidate' && (
                  <>
                    <Link
                      to="/candidate"
                      className={`px-3 py-1.5 rounded-lg transition-colors ${
                        location.pathname === '/candidate'
                          ? 'text-blue-600 font-semibold bg-blue-50/60'
                          : 'hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      Candidate Dashboard
                    </Link>
                    <Link
                      to="/resume-skills"
                      className={`px-3 py-1.5 rounded-lg transition-colors ${
                        location.pathname === '/resume-skills'
                          ? 'text-blue-600 font-semibold bg-blue-50/60'
                          : 'hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      Resume & Skills
                    </Link>
                  </>
                )}
                {role === 'recruiter' && (
                  <>
                    <Link
                      to="/recruiter"
                      className={`px-3 py-1.5 rounded-lg transition-colors ${
                        location.pathname === '/recruiter'
                          ? 'text-blue-600 font-semibold bg-blue-50/60'
                          : 'hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      Recruiter Dashboard
                    </Link>
                    <Link
                      to="/screening"
                      className={`px-3 py-1.5 rounded-lg transition-colors ${
                        location.pathname === '/screening'
                          ? 'text-blue-600 font-semibold bg-blue-50/60'
                          : 'hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      Screening & Ranking
                    </Link>
                    <Link
                      to="/post-job"
                      className={`px-3 py-1.5 rounded-lg transition-colors ${
                        location.pathname === '/post-job'
                          ? 'text-blue-600 font-semibold bg-blue-50/60'
                          : 'hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      Post Job
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Right Side: Demo User Switcher, Notifications, Auth */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Quick Switch Demo User Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setDemoSwitchOpen(!demoSwitchOpen);
                    setProfileDropdownOpen(false);
                    setNotifDropdownOpen(false);
                  }}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50/60 hover:bg-blue-100/60 text-blue-700 text-xs font-semibold transition-all shadow-subtle"
                  title="Switch between demo accounts to test workflows"
                >
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  <span className="truncate max-w-[130px]">
                    {currentUser ? currentUser.name : 'Switch User'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-blue-500" />
                </button>

                {demoSwitchOpen && (
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-elevated p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">Switch Demo Account</p>
                      <p className="text-[11px] text-slate-500">
                        Test candidate matching or recruiter review immediately:
                      </p>
                    </div>

                    <div className="py-1">
                      <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Recruiter Account
                      </p>
                      {recruiters.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => handleSwitchUser(r.id)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                            currentUser?.id === r.id
                              ? 'bg-blue-50 text-blue-700 font-bold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div>
                            <p className="font-semibold">{r.name}</p>
                            <p className="text-[10px] text-slate-500">{r.company}</p>
                          </div>
                          {currentUser?.id === r.id && (
                            <CheckCircle2 className="w-4 h-4 text-blue-600" />
                          )}
                        </button>
                      ))}

                      <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Candidate Accounts
                      </p>
                      {candidates.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => handleSwitchUser(c.id)}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                            currentUser?.id === c.id
                              ? 'bg-blue-50 text-blue-700 font-bold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div>
                            <p className="font-semibold">{c.name}</p>
                            <p className="text-[10px] text-slate-500 truncate max-w-[180px]">
                              {c.skills?.join(', ')}
                            </p>
                          </div>
                          {currentUser?.id === c.id && (
                            <CheckCircle2 className="w-4 h-4 text-blue-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Reset Prototype Data Button */}
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Reset demo data to initial state"
                aria-label="Reset prototype data"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Notifications Bell */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setNotifDropdownOpen(!notifDropdownOpen);
                    setProfileDropdownOpen(false);
                    setDemoSwitchOpen(false);
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors relative"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                </button>

                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-elevated p-2 z-50">
                    <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900">Notifications</p>
                      <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        2 unread
                      </span>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                      {notifications.map((n) => (
                        <div key={n.id} className="p-3 hover:bg-slate-50 transition-colors text-xs">
                          <p className="font-semibold text-slate-900 flex items-center justify-between">
                            {n.title}
                            <span className="text-[10px] text-slate-400 font-normal">{n.time}</span>
                          </p>
                          <p className="text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Auth / Profile Area */}
              {currentUser ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(!profileDropdownOpen);
                      setNotifDropdownOpen(false);
                      setDemoSwitchOpen(false);
                    }}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                      {currentUser.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div className="hidden lg:block text-left">
                      <p className="text-xs font-bold text-slate-900 leading-tight">
                        {currentUser.name}
                      </p>
                      <p className="text-[10px] font-medium text-slate-500 capitalize">
                        {currentUser.role}
                      </p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:block" />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-elevated p-2 z-50">
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      </div>
                      <div className="py-1 text-xs text-slate-700">
                        {currentUser.role === 'candidate' ? (
                          <>
                            <Link
                              to="/candidate"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="block px-3 py-2 rounded-xl hover:bg-slate-50 font-medium"
                            >
                              Candidate Dashboard
                            </Link>
                            <Link
                              to="/resume-skills"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="block px-3 py-2 rounded-xl hover:bg-slate-50 font-medium"
                            >
                              My Profile & Resume
                            </Link>
                          </>
                        ) : (
                          <>
                            <Link
                              to="/recruiter"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="block px-3 py-2 rounded-xl hover:bg-slate-50 font-medium"
                            >
                              Recruiter Dashboard
                            </Link>
                            <Link
                              to="/screening"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="block px-3 py-2 rounded-xl hover:bg-slate-50 font-medium"
                            >
                              Screening & Ranking
                            </Link>
                            <Link
                              to="/post-job"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="block px-3 py-2 rounded-xl hover:bg-slate-50 font-medium"
                            >
                              Post a New Job
                            </Link>
                          </>
                        )}
                      </div>
                      <div className="pt-1 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setProfileDropdownOpen(false);
                            toast.info('Logged out of demo session');
                            navigate('/auth');
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 font-semibold flex items-center gap-2"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/auth"
                    className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/auth"
                    className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-all"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile menu hamburger button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Home
            </Link>
            <Link
              to="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Browse Jobs
            </Link>
            {role === 'candidate' && (
              <>
                <Link
                  to="/candidate"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-semibold text-blue-600 bg-blue-50"
                >
                  Candidate Dashboard
                </Link>
                <Link
                  to="/resume-skills"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Resume & Skills
                </Link>
              </>
            )}
            {role === 'recruiter' && (
              <>
                <Link
                  to="/recruiter"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-semibold text-blue-600 bg-blue-50"
                >
                  Recruiter Dashboard
                </Link>
                <Link
                  to="/screening"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Screening & Ranking
                </Link>
                <Link
                  to="/post-job"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Post a Job
                </Link>
              </>
            )}
            <div className="pt-3 border-t border-slate-100">
              <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Demo Accounts
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    handleSwitchUser('usr-1');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-1.5 rounded-lg text-xs bg-slate-50 font-medium text-slate-700 hover:bg-blue-50"
                >
                  Rahul (Candidate)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleSwitchUser('rec-1');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left px-3 py-1.5 rounded-lg text-xs bg-slate-50 font-medium text-slate-700 hover:bg-blue-50"
                >
                  TechNova Recruiter
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Confirmation Modal for Resetting Demo Data */}
      <ConfirmModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        onConfirm={handleResetData}
        title="Reset Demo Data"
        message="This will reset all candidate profiles, job postings, and applications back to the initial prototype state. Great for running fresh demonstrations."
        confirmText="Reset Everything"
        type="warning"
      />
    </>
  );
};
