import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Notification({ notification, onClose }) {
  if (!notification) return null;

  const isSuccess = notification.type === 'success';

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm animate-bounce-short">
      <div
        className={`flex items-start space-x-3 p-4 rounded-xl shadow-lg border ${
          isSuccess
            ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
            : 'bg-rose-50 border-rose-200 text-rose-900'
        }`}
      >
        {isSuccess ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
        )}
        <div className="flex-1 text-sm font-medium">{notification.message}</div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
