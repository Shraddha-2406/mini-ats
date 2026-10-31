import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { Modal } from './Modal';

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger', // 'danger' | 'warning' | 'info'
}) => {
  const typeConfig = {
    danger: {
      Icon: AlertCircle,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-50 border border-rose-100',
      btnBg: 'bg-rose-600 hover:bg-rose-700 text-white',
    },
    warning: {
      Icon: AlertTriangle,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50 border border-amber-100',
      btnBg: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
    info: {
      Icon: Info,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50 border border-blue-100',
      btnBg: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
  };

  const config = typeConfig[type] || typeConfig.danger;
  const { Icon } = config;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center py-2">
        <div className={`p-3 rounded-full mb-4 ${config.iconBg}`}>
          <Icon className={`w-8 h-8 ${config.iconColor}`} />
        </div>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          {message}
        </p>

        <div className="flex items-center gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors text-sm"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-colors text-sm shadow-sm ${config.btnBg}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
