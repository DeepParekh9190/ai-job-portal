import React, { useState } from 'react';
import Card from '../common/Card';
import { Download, Share2, Eye, Edit } from 'lucide-react';
import Button from '../common/Button';

const ResumePreview = ({ resume, actions = true }) => {
  const [activeTab, setActiveTab] = useState('preview');

  if (!resume) return <Card>No resume selected</Card>;

  return (
    <Card className="relative overflow-hidden">
      {/* Header Actions */}
      {actions && (
        <div className="absolute top-4 right-4 flex gap-2">
          <Button variant="secondary" size="icon" onClick={() => window.print()}>
            <Download size={16} />
          </Button>
          <Button variant="secondary" size="icon">
            <Share2 size={16} />
          </Button>
        </div>
      )}

      {/* Resume Content (Simplified A4 View) */}
      <div className="bg-white text-black p-8 rounded-lg shadow-xl max-w-[210mm] mx-auto min-h-[297mm]">
        {/* Header */}
        <div className="text-center border-b-2 border-gray-800 pb-6 mb-6">
          <h1 className="text-3xl font-bold uppercase tracking-wide mb-2">
            {resume.personalInfo?.fullName}
          </h1>
          <div className="flex justify-center flex-wrap gap-4 text-sm text-gray-600">
            {resume.personalInfo?.email && <span>{resume.personalInfo.email}</span>}
            {resume.personalInfo?.phone && <span>• {resume.personalInfo.phone}</span>}
            {resume.personalInfo?.location && <span>• {resume.personalInfo.location}</span>}
            {resume.personalInfo?.linkedin && <span>• {resume.personalInfo.linkedin}</span>}
          </div>
        </div>

        {/* Summary */}
        {resume.summary && (
          <div className="mb-6">
            <h2 className="text-lg font-bold border-b border-gray-300 mb-3 uppercase">Professional Summary</h2>
            <p className="text-sm text-gray-700 leading-relaxed">{resume.summary}</p>
          </div>
        )}

        {/* Experience */}
        {resume.experience?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold border-b border-gray-300 mb-3 uppercase">Work Experience</h2>
            <div className="space-y-4">
              {resume.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold">{exp.title}</h3>
                    <span className="text-sm text-gray-600">
                      {new Date(exp.startDate).getFullYear()} - {exp.current ? 'Present' : new Date(exp.endDate).getFullYear()}
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
        {resume.education?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold border-b border-gray-300 mb-3 uppercase">Education</h2>
            <div className="space-y-3">
              {resume.education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold">{edu.institution}</h3>
                    <span className="text-sm text-gray-600">{edu.year}</span>
                  </div>
                  <p className="text-sm text-gray-700">{edu.degree}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {resume.skills && (
          <div className="mb-6">
            <h2 className="text-lg font-bold border-b border-gray-300 mb-3 uppercase">Skills</h2>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <div className="w-full">
                <span className="font-bold text-sm">Technical: </span>
                <span className="text-sm text-gray-700">
                  {resume.skills.technical?.join(', ')}
                </span>
              </div>
              <div className="w-full">
                <span className="font-bold text-sm">Soft Skills: </span>
                <span className="text-sm text-gray-700">
                  {resume.skills.soft?.join(', ')}
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
