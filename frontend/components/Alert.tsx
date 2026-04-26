import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  type: AlertType;
  title?: string;
  message: string;
  details?: string[];
  onClose?: () => void;
  dismissible?: boolean;
}

const icons: Record<AlertType, React.ReactNode> = {
  success: <CheckCircle size={20} />,
  error: <AlertCircle size={20} />,
  warning: <AlertTriangle size={20} />,
  info: <Info size={20} />,
};

export function Alert({ 
  type, 
  title, 
  message, 
  details, 
  onClose, 
  dismissible = true 
}: AlertProps) {
  return (
    <div className={`alert alert-${type}`} role="alert">
      <div className="flex-shrink-0">{icons[type]}</div>
      <div className="flex-grow">
        {title && (
          <div className="font-semibold mb-1">{title}</div>
        )}
        <div className="text-sm leading-5">{message}</div>
        {details && details.length > 0 && (
          <ul className="mt-2 text-sm list-disc list-inside opacity-80">
            {details.map((detail, idx) => (
              <li key={idx}>{detail}</li>
            ))}
          </ul>
        )}
      </div>
      {dismissible && onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-4 text-current opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Close alert"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
