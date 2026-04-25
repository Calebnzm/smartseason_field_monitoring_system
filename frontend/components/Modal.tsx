import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-content ${sizeClasses[size]} w-90vw`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title !== undefined || onClose !== undefined) && (
          <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
            {title && <h2 className="text-lg font-semibold text-[var(--color-text)]">{title}</h2>}
            {onClose && (
              <button
                onClick={onClose}
                className="ml-auto text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            )}
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
