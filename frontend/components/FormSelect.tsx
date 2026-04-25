import React, { SelectHTMLAttributes } from 'react';
import { FieldError } from 'react-hook-form';

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: FieldError;
  helperText?: string;
  required?: boolean;
  options: Array<{ value: string | number; label: string }>;
}

export function FormSelect({
  label,
  error,
  helperText,
  required,
  options,
  id,
  className,
  ...props
}: FormSelectProps) {
  const selectId = id || props.name;

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={selectId} className={`form-label ${required ? 'required' : ''}`}>
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`form-select ${error ? 'border-[var(--color-danger)]' : ''} ${className || ''}`}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="form-error">{error.message}</span>}
      {helperText && !error && <span className="text-xs text-[var(--color-text-secondary)]">{helperText}</span>}
    </div>
  );
}
