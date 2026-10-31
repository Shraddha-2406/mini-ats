import React from 'react';
import { getMatchScoreColor } from '../services/matchingService';

export const MatchScoreRing = ({
  score = 0,
  size = 'md',
  strokeWidth = 6,
  showLabel = true,
  subLabel = '',
}) => {
  const safeScore = Math.max(0, Math.min(100, Math.round(score)));
  const { ringColor, textClass, category } = getMatchScoreColor(safeScore);

  const dimensions = {
    sm: { size: 48, stroke: 4, text: 'text-xs font-bold' },
    md: { size: 76, stroke: 6, text: 'text-base font-extrabold' },
    lg: { size: 120, stroke: 8, text: 'text-2xl font-black' },
    xl: { size: 160, stroke: 10, text: 'text-4xl font-black' },
  };

  const dim = dimensions[size] || dimensions.md;
  const radius = (dim.size - dim.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative inline-flex items-center justify-center" style={{ width: dim.size, height: dim.size }}>
        <svg
          className="transform -rotate-90 transition-all duration-700 ease-out"
          width={dim.size}
          height={dim.size}
        >
          {/* Background Track */}
          <circle
            cx={dim.size / 2}
            cy={dim.size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={dim.stroke}
            fill="transparent"
          />
          {/* Progress Arc */}
          <circle
            cx={dim.size / 2}
            cy={dim.size / 2}
            r={radius}
            stroke={ringColor}
            strokeWidth={dim.stroke}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {showLabel && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className={`${dim.text} ${textClass} tracking-tight`}>
              {safeScore}%
            </span>
          </div>
        )}
      </div>

      {subLabel && (
        <span className="text-xs font-medium text-slate-500 mt-1.5 text-center">
          {subLabel}
        </span>
      )}
    </div>
  );
};
