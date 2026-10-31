import React from 'react';
import { Check, Plus, X, AlertCircle } from 'lucide-react';

export const SkillChip = ({
  name,
  variant = 'default', // 'default' | 'matched' | 'missing' | 'candidate' | 'selectable'
  isSelected = false,
  onSelect,
  onRemove,
  onAdd,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-medium px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-medium px-3 py-1.5 gap-2',
  };

  // Matched skill: Green with check icon
  if (variant === 'matched') {
    return (
      <span
        className={`inline-flex items-center rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm ${sizeClasses[size]} ${className}`}
      >
        <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
        <span>{name}</span>
      </span>
    );
  }

  // Missing skill: Amber/Red with warning/gap icon
  if (variant === 'missing') {
    return (
      <span
        className={`inline-flex items-center rounded-lg bg-rose-50 text-rose-800 border border-rose-200 shadow-sm ${sizeClasses[size]} ${className}`}
      >
        <X className="w-3.5 h-3.5 text-rose-500 stroke-[2.5]" />
        <span>{name}</span>
      </span>
    );
  }

  // Selectable skill in candidate profile or job creation
  if (variant === 'selectable') {
    return (
      <button
        type="button"
        onClick={() => onSelect && onSelect(name)}
        className={`inline-flex items-center rounded-lg transition-all duration-150 border font-medium ${
          sizeClasses[size]
        } ${
          isSelected
            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
            : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
        } ${className}`}
      >
        {isSelected ? (
          <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
        ) : (
          <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-500" />
        )}
        <span>{name}</span>
      </button>
    );
  }

  // Removable skill badge (e.g. in candidate skills list or job creation list)
  return (
    <span
      className={`inline-flex items-center rounded-lg bg-slate-100 text-slate-800 border border-slate-200 ${sizeClasses[size]} ${className}`}
    >
      <span>{name}</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove(name);
          }}
          className="text-slate-400 hover:text-rose-600 transition-colors ml-0.5 rounded-full p-0.5"
          aria-label={`Remove ${name}`}
        >
          <X className="w-3 h-3 stroke-[2.5]" />
        </button>
      )}
      {onAdd && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAdd(name);
          }}
          className="text-blue-600 hover:text-blue-800 transition-colors ml-0.5 rounded-full p-0.5"
          aria-label={`Add ${name}`}
        >
          <Plus className="w-3 h-3 stroke-[2.5]" />
        </button>
      )}
    </span>
  );
};
