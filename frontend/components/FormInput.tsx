import React, { InputHTMLAttributes } from 'react';
import { FieldError } from 'react-hook-form';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: FieldError;
  helperText?: string;
  required?: boolean;
}

export function FormInput({
  label,
  error,
  helperText,
  required,
  id,
  className,
  ...props
}: FormInputProps) {
  const inputId = id || props.name;

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId} className={`form-label ${required ? 'required' : ''}`}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`form-input ${error ? 'border-[var(--color-danger)]' : ''} ${className || ''}`}
        {...props}
      />
      {error && <span className="form-error">{error.message}</span>}
      {helperText && !error && <span className="text-xs text-[var(--color-text-secondary)]">{helperText}</span>}
    </div>
  );
}
