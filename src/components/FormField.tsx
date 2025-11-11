import React from 'react';
import { AlertCircle } from 'lucide-react';
import { FormField as FormFieldType, Language } from '../types';
import { t } from '../utils/i18n';

interface FormFieldProps {
  field: FormFieldType;
  value: any;
  onChange: (value: any) => void;
  language: Language;
  error?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  field,
  value,
  onChange,
  language,
  error
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const newValue = field.type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked
      : field.type === 'number'
      ? parseFloat(e.target.value) || 0
      : e.target.value;
    
    onChange(newValue);
  };

  const fieldId = `field-${field.name}`;
  const isRequired = field.required;
  const hasError = !!error;

  const baseInputClasses = `form-input ${hasError ? 'border-red-500 focus:ring-red-500' : ''}`;

  return (
    <div className="space-y-2">
      {/* Label */}
      <label htmlFor={fieldId} className="form-label">
        {field.label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input Field */}
      {field.type === 'textarea' ? (
        <textarea
          id={fieldId}
          value={value || ''}
          onChange={handleChange}
          placeholder={field.placeholder}
          required={isRequired}
          rows={3}
          className={`${baseInputClasses} resize-vertical`}
          aria-describedby={field.description ? `${fieldId}-description` : undefined}
          aria-invalid={hasError}
        />
      ) : field.type === 'select' ? (
        <select
          id={fieldId}
          value={value || ''}
          onChange={handleChange}
          required={isRequired}
          className={`${baseInputClasses} cursor-pointer`}
          aria-describedby={field.description ? `${fieldId}-description` : undefined}
          aria-invalid={hasError}
        >
          <option value="">Select...</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : field.type === 'checkbox' ? (
        <div className="flex items-center space-x-3">
          <input
            id={fieldId}
            type="checkbox"
            checked={value || false}
            onChange={handleChange}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 
                     focus:ring-2 dark:border-gray-600 dark:bg-gray-700"
            aria-describedby={field.description ? `${fieldId}-description` : undefined}
          />
          <label htmlFor={fieldId} className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            {field.description || field.label}
          </label>
        </div>
      ) : (
        <input
          id={fieldId}
          type={field.type}
          value={value || ''}
          onChange={handleChange}
          placeholder={field.placeholder}
          required={isRequired}
          min={field.validation?.min}
          max={field.validation?.max}
          pattern={field.validation?.pattern}
          step={field.type === 'number' ? 'any' : undefined}
          className={baseInputClasses}
          aria-describedby={field.description ? `${fieldId}-description` : undefined}
          aria-invalid={hasError}
        />
      )}

      {/* Description */}
      {field.description && field.type !== 'checkbox' && (
        <p id={`${fieldId}-description`} className="text-sm text-gray-600 dark:text-gray-400">
          {field.description}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Validation Pattern Info */}
      {field.validation?.message && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-500">
          {field.validation.message}
        </p>
      )}
    </div>
  );
};

export default FormField;