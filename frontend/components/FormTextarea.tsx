import React, { TextareaHTMLAttributes } from 'react';
import { FieldError } from 'react-hook-form';

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: FieldError;
  helperText?: string;
  required?: boolean;
}

export function FormTextarea({
  label,
  error,
  helperText,
  required,
  id,
  className,
  ...props
}: FormTextareaProps) {
  const textareaId = id || props.name;

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={textareaId} className={`form-label ${required ? 'required' : ''}`}>
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`form-textarea ${error ? 'border-[var(--color-danger)]' : ''} ${className || ''}`}
        {...props}
      />
      {error && <span className="form-error">{error.message}</span>}
      {helperText && !error && <span className="text-xs text-[var(--color-text-secondary)]">{helperText}</span>}
    </div>
  );
}
