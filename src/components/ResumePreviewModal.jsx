import React from 'react';
import { FileText, Download, CheckCircle2, User, Mail, Phone, MapPin, GraduationCap, Briefcase } from 'lucide-react';
import { Modal } from './Modal';

export const ResumePreviewModal = ({ isOpen, onClose, candidate }) => {
  if (!candidate) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Resume Document Preview"
      subtitle={`Local session document for ${candidate.name} (Simulation)`}
      maxWidth="max-w-3xl"
    >
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 font-sans shadow-inner">
        {/* Document Header */}
        <div className="border-b-2 border-blue-600 pb-5 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {candidate.name}
              </h1>
              <p className="text-sm font-semibold text-blue-600 mt-0.5">
                {candidate.headline || 'Software Engineering Candidate'}
              </p>
            </div>
            <div className="flex flex-col text-xs text-slate-600 gap-1 text-left sm:text-right">
              <span className="flex items-center sm:justify-end gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {candidate.email}
              </span>
              <span className="flex items-center sm:justify-end gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {candidate.phone || '+91 98765 43210'}
              </span>
              <span className="flex items-center sm:justify-end gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {candidate.location || 'India'}
              </span>
            </div>
          </div>
        </div>

        {/* Education Section */}
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            Education & Academic Background
          </h2>
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{candidate.education || 'Pune University'}</h3>
                <p className="text-xs text-slate-600 mt-0.5">{candidate.degree || 'Bachelor of Engineering in Computer Science'}</p>
              </div>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Graduation: {candidate.gradYear || '2025'}
              </span>
            </div>
          </div>
        </div>

        {/* Experience Section */}
        <div className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-blue-600" />
            Professional Experience & Projects
          </h2>
          <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Academic & Project Portfolio</h3>
                <span className="text-xs text-slate-500">
                  {candidate.experienceYears ? `${candidate.experienceYears} Year(s) Exp` : 'Fresher / Entry Level'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Demonstrated practical experience building modular software projects, participating in version-controlled workflows, relational database query design, and client-server architectures.
              </p>
            </div>
          </div>
        </div>

        {/* Verified Technical Skills */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            Verified Technical Skills ({candidate.skills?.length || 0})
          </h2>
          <div className="flex flex-wrap gap-1.5 bg-white p-4 rounded-lg border border-slate-200">
            {candidate.skills && candidate.skills.length > 0 ? (
              candidate.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                >
                  {skill}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">No skills listed yet</span>
            )}
          </div>
        </div>

        {/* Local storage note banner */}
        <div className="mt-6 p-3 bg-blue-50/60 border border-blue-200/60 rounded-lg text-xs text-blue-700 flex items-center justify-between">
          <span>
            Document: <strong>{candidate.resumeMeta?.fileName || 'Resume.pdf'}</strong> ({candidate.resumeMeta?.fileSize || 'Local Session'})
          </span>
          <span className="text-[11px] text-blue-600">Simulated PDF Rendering</span>
        </div>
      </div>
    </Modal>
  );
};
