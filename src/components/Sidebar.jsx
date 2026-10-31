import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  FileText,
  Briefcase,
  Layers,
  Award,
  PlusCircle,
  Users,
  BarChart3,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const Sidebar = ({ role = 'candidate', activeTab, onTabChange }) => {
  const { currentUser, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully');
    navigate('/auth');
  };

  const candidateLinks = [
    {
      label: 'Dashboard',
      to: '/candidate',
      icon: LayoutDashboard,
      id: 'dashboard',
    },
    {
      label: 'My Profile & Skills',
      to: '/resume-skills',
      icon: User,
      id: 'profile',
    },
    {
      label: 'Resume Upload',
      to: '/resume-skills',
      icon: FileText,
      id: 'resume',
    },
    {
      label: 'Browse Jobs',
      to: '/jobs',
      icon: Briefcase,
      id: 'jobs',
    },
    {
      label: 'Match Analysis',
      to: '/match-analysis',
      icon: Award,
      id: 'match',
    },
  ];

  const recruiterLinks = [
    {
      label: 'Dashboard',
      to: '/recruiter',
      icon: LayoutDashboard,
      id: 'dashboard',
    },
    {
      label: 'Post New Job',
      to: '/post-job',
      icon: PlusCircle,
      id: 'post-job',
    },
    {
      label: 'Screening & Ranking',
      to: '/screening',
      icon: Users,
      id: 'screening',
    },
    {
      label: 'Job Listings',
      to: '/jobs',
      icon: Briefcase,
      id: 'jobs',
    },
  ];

  const links = role === 'recruiter' ? recruiterLinks : candidateLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 hidden lg:flex flex-col justify-between p-4 sticky top-16 h-[calc(100vh-4rem)] flex-shrink-0">
      <div>
        {/* User Card */}
        <div className="p-3 mb-4 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
            {currentUser?.name
              ? currentUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
              : 'U'}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-slate-900 truncate">
              {currentUser?.name || 'Rahul Sharma'}
            </h4>
            <p className="text-[10px] text-slate-500 font-medium capitalize truncate">
              {role === 'recruiter'
                ? currentUser?.company || 'Recruiter'
                : currentUser?.degree || 'Candidate'}
            </p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Main Menu
          </p>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.id}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-subtle border border-blue-100'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-40" />
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Footer / Logout */}
      <div className="pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
