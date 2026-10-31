import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';

// 9 Main Screens
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { CandidateDashboard } from './pages/CandidateDashboard';
import { ResumeSkillsPage } from './pages/ResumeSkillsPage';
import { JobListingsPage } from './pages/JobListingsPage';
import { RecruiterDashboard } from './pages/RecruiterDashboard';
import { PostJobPage } from './pages/PostJobPage';
import { ScreeningRankingPage } from './pages/ScreeningRankingPage';
import { MatchAnalysisPage } from './pages/MatchAnalysisPage';

export function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-700">
            {/* Global SaaS Navigation Bar */}
            <Navbar />

            {/* 9 Main Screen Routes */}
            <div className="flex-1">
              <Routes>
                {/* Screen 1: Home / Landing Page */}
                <Route path="/" element={<HomePage />} />

                {/* Screen 2: Login & Registration */}
                <Route path="/auth" element={<AuthPage />} />

                {/* Screen 3: Candidate Dashboard */}
                <Route path="/candidate" element={<CandidateDashboard />} />

                {/* Screen 4: Resume Upload & Skills */}
                <Route path="/resume-skills" element={<ResumeSkillsPage />} />

                {/* Screen 5: Job Listings & Application */}
                <Route path="/jobs" element={<JobListingsPage />} />

                {/* Screen 6: Recruiter Dashboard */}
                <Route path="/recruiter" element={<RecruiterDashboard />} />

                {/* Screen 7: Post & Manage Jobs */}
                <Route path="/post-job" element={<PostJobPage />} />

                {/* Screen 8: Candidate Screening & Ranking */}
                <Route path="/screening" element={<ScreeningRankingPage />} />

                {/* Screen 9: Match Results & Missing Skills */}
                <Route path="/match-analysis" element={<MatchAnalysisPage />} />

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
