import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue', // 'blue' | 'emerald' | 'indigo' | 'amber' | 'purple'
  badge,
  onClick,
}) => {
  const colorSchemes = {
    blue: {
      iconBg: 'bg-blue-50 text-blue-600 border border-blue-100',
      badgeBg: 'bg-blue-50 text-blue-700',
      accentBorder: 'hover:border-blue-300',
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      badgeBg: 'bg-emerald-50 text-emerald-700',
      accentBorder: 'hover:border-emerald-300',
    },
    indigo: {
      iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
      badgeBg: 'bg-indigo-50 text-indigo-700',
      accentBorder: 'hover:border-indigo-300',
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
      badgeBg: 'bg-amber-50 text-amber-700',
      accentBorder: 'hover:border-amber-300',
    },
    purple: {
      iconBg: 'bg-purple-50 text-purple-600 border border-purple-100',
      badgeBg: 'bg-purple-50 text-purple-700',
      accentBorder: 'hover:border-purple-300',
    },
  };

  const scheme = colorSchemes[color] || colorSchemes.blue;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border border-slate-200/80 shadow-subtle transition-all duration-200 ${
        scheme.accentBorder
      } ${onClick ? 'cursor-pointer hover:shadow-card hover:-translate-y-0.5' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {value}
          </h3>
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl ${scheme.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || badge) && (
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          {subtitle && <span>{subtitle}</span>}
          {badge && (
            <span className={`px-2 py-0.5 rounded-full font-semibold ${scheme.badgeBg}`}>
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
