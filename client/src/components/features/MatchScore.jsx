import React from 'react';
import Card from '../common/Card';

const MatchScore = ({ score = 0, breakdown }) => {
  const getScoreColor = (value) => {
    if (value >= 85) return 'text-green-400';
    if (value >= 70) return 'text-electric-purple';
    if (value >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressColor = (value) => {
    if (value >= 85) return 'bg-green-400';
    if (value >= 70) return 'bg-electric-purple';
    if (value >= 50) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  return (
    <Card className="bg-gradient-to-br from-white/5 to-transparent">
      <div className="text-center mb-6">
        <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">AI Match Score</h3>
        <div className="relative inline-flex items-center justify-center">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle cx="64" cy="64" r="60" stroke="#1f2937" strokeWidth="8" fill="none" />
            <circle 
              cx="64" 
              cy="64" 
              r="60" 
              stroke="currentColor" 
              strokeWidth="8" 
              fill="none" 
              strokeDasharray={2 * Math.PI * 60}
              strokeDashoffset={2 * Math.PI * 60 * (1 - score / 100)}
              className={`${getScoreColor(score)} transition-all duration-1000 ease-out`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className={`text-4xl font-bold ${getScoreColor(score)}`}>{score}%</span>
          </div>
        </div>
      </div>

      {breakdown && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Skills Match</span>
              <span className="font-bold text-white">{breakdown.skills?.score || 0}%</span>
            </div>
            <div className="h-2 bg-midnight-900 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${getProgressColor(breakdown.skills?.score || 0)}`} 
                style={{ width: `${breakdown.skills?.score || 0}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Experience</span>
              <span className="font-bold text-white">{breakdown.experience?.score || 0}%</span>
            </div>
            <div className="h-2 bg-midnight-900 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${getProgressColor(breakdown.experience?.score || 0)}`} 
                style={{ width: `${breakdown.experience?.score || 0}%` }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Education</span>
              <span className="font-bold text-white">{breakdown.education?.score || 0}%</span>
            </div>
            <div className="h-2 bg-midnight-900 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${getProgressColor(breakdown.education?.score || 0)}`} 
                style={{ width: `${breakdown.education?.score || 0}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default MatchScore;
