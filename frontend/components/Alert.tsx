import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  type: AlertType;
  title?: string;
  message: string;
  onClose?: () => void;
}

const icons: Record<AlertType, React.ReactNode> = {
  success: <CheckCircle size={20} />,
  error: <AlertCircle size={20} />,
  warning: <AlertTriangle size={20} />,
  info: <Info size={20} />,
};

export function Alert({ type, title, message, onClose }: AlertProps) {
  return (
    <div className={`alert alert-${type}`}>
      <div className="flex-shrink-0">{icons[type]}</div>
      <div className="flex-grow">
        {title && <div className="font-semibold mb-1">{title}</div>}
        <div className="text-sm">{message}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-4 text-current opacity-70 hover:opacity-100"
          aria-label="Close alert"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
