import React, { useState } from 'react';
import Card from '../common/Card';
import { Download, Share2, Eye, Edit, FileText } from 'lucide-react';
import Button from '../common/Button';

const ResumePreview = ({ resume, actions = true }) => {
  const [activeTab, setActiveTab] = useState('preview');

  if (!resume) return <Card>No resume selected</Card>;

  let parsedResume = {};
  if (resume.content) {
     try {
        parsedResume = typeof resume.content === 'string' ? JSON.parse(resume.content) : resume.content;
     } catch (e) {
        // Fallback if not valid JSON
     }
  }

  // Handle uploaded files vs AI profiles
  if (resume.type === 'uploaded' || (resume.url && !resume.content)) {
     return (
        <div className="flex flex-col items-center justify-center p-12 bg-white/5 rounded-2xl border border-white/10 h-full">
           <FileText className="w-16 h-16 text-electric-purple mb-4" />
           <p className="text-white font-bold mb-2">Attached File: {resume.filename}</p>
           <a 
             href={resume.url} 
             target="_blank" 
             rel="noreferrer"
             className="text-gold text-sm font-black uppercase tracking-widest hover:underline flex items-center gap-2 mt-4"
           >
             <Download size={14} /> Open Document
           </a>
        </div>
     );
  }

  // Handle empty AI profiles without content
  if (!resume.content && !resume.url) {
     return (
        <div className="flex flex-col items-center justify-center p-12 bg-white/5 rounded-2xl border border-white/10 h-full">
           <FileText className="w-16 h-16 text-electric-purple mb-4" />
           <p className="text-white font-bold mb-2">{resume.filename || 'Candidate Profile'}</p>
           <p className="text-gray-400 text-sm mb-6 text-center max-w-sm">This candidate applied using their integrated platform profile. You can review their full AI Match Score and capabilities from the Dossier summary above.</p>
        </div>
     );
  }

  // Handle AI generated profiles
  const r = parsedResume.personalInfo ? parsedResume : (parsedResume.profile ? parsedResume.profile : {});

  return (
    <Card className="relative overflow-hidden bg-white">
      {/* Header Actions */}
      {actions && (
        <div className="absolute top-4 right-4 flex gap-2">
          <Button variant="secondary" size="icon" onClick={() => window.print()} className="bg-gray-100 text-black border-gray-200">
            <Download size={16} />
          </Button>
        </div>
      )}

      {/* Resume Content (Simplified A4 View) */}
      <div className="bg-white text-black p-8 rounded-lg max-w-[210mm] mx-auto min-h-[297mm]">
        {/* Header */}
        <div className="text-center border-b-2 border-gray-800 pb-6 mb-6">
          <h1 className="text-3xl font-bold uppercase tracking-wide mb-2">
            {r.personalInfo?.fullName || r.name || 'Candidate Profile'}
          </h1>
          <div className="flex justify-center flex-wrap gap-4 text-sm text-gray-600">
            {(r.personalInfo?.email || r.email) && <span>{r.personalInfo?.email || r.email}</span>}
            {(r.personalInfo?.phone || r.phone) && <span>• {r.personalInfo?.phone || r.phone}</span>}
            {(r.personalInfo?.location || r.location) && <span>• {r.personalInfo?.location || r.location}</span>}
          </div>
        </div>

        {/* Summary */}
        {(r.summary || r.bio) && (
          <div className="mb-6">
            <h2 className="text-lg font-bold border-b border-gray-300 mb-3 uppercase">Professional Summary</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{r.summary || r.bio}</p>
          </div>
        )}

        {/* Experience */}
        {(r.experience?.length > 0 || r.professional?.experienceHistory?.length > 0) && (
          <div className="mb-6">
            <h2 className="text-lg font-bold border-b border-gray-300 mb-3 uppercase">Work Experience</h2>
            <div className="space-y-4">
              {(r.experience || r.professional?.experienceHistory || []).map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold">{exp.title || exp.jobTitle}</h3>
                    <span className="text-sm text-gray-600">
                      {exp.startDate ? new Date(exp.startDate).getFullYear() : ''} - {exp.current ? 'Present' : (exp.endDate ? new Date(exp.endDate).getFullYear() : '')}
                    </span>
                  </div>
                  <p className="font-semibold text-sm mb-1">{exp.company}</p>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {(r.education?.length > 0) && (
          <div className="mb-6">
            <h2 className="text-lg font-bold border-b border-gray-300 mb-3 uppercase">Education</h2>
            <div className="space-y-3">
              {(r.education || []).map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold">{edu.institution || edu.school}</h3>
                    <span className="text-sm text-gray-600">{edu.year || edu.graduationYear}</span>
                  </div>
                  <p className="text-sm text-gray-700">{edu.degree}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {(r.skills || r.professional?.skills) && (
          <div className="mb-6">
            <h2 className="text-lg font-bold border-b border-gray-300 mb-3 uppercase">Skills</h2>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <div className="w-full">
                <span className="text-sm text-gray-700">
                   {Array.isArray(r.skills) ? r.skills.join(', ') : 
                    Array.isArray(r.professional?.skills) ? r.professional.skills.join(', ') :
                    (r.skills?.technical?.join(', ') || '')}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ResumePreview;
