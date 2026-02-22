import React, { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react'; // Icons for error/success feedback
import { MagicIcon } from './ui/MagicIcon';

interface ModernInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  error?: boolean;
  errorMessage?: string;
  success?: boolean;
  disabled?: boolean;
  id?: string; // For accessibility
  multiline?: boolean; // New prop for textarea
  rows?: number;       // New prop for textarea rows
  maxLength?: number;  // New prop for validation
  mask?: string;       // New prop for input masking
}

export const ModernInput: React.FC<ModernInputProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  error = false,
  errorMessage,
  success = false,
  disabled = false,
  id = label.replace(/\s+/g, '-').toLowerCase(), // Generate a basic ID if not provided
  multiline = false, // Default to false
  rows = 3,          // Default rows for textarea
  maxLength,
  mask, // Destructure the new mask prop
}) => {
  const [isTyping, setIsTyping] = useState(false);

  // Function to apply the mask to the input value
  const applyMask = (value: string, mask: string) => {
    let maskedValue = '';
    let valueIndex = 0;
    for (let maskIndex = 0; maskIndex < mask.length; maskIndex++) {
      if (valueIndex >= value.length) {
        break;
      }
      if (mask[maskIndex] === '9') {
        if (/\d/.test(value[valueIndex])) {
          maskedValue += value[valueIndex];
          valueIndex++;
        } else {
          // If the current character in value is not a digit, stop
          break;
        }
      } else {
        maskedValue += mask[maskIndex];
        if (value[valueIndex] === mask[maskIndex]) {
            valueIndex++;
        }
      }
    }
    return maskedValue;
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = mask ? applyMask(e.target.value, mask) : e.target.value;
    onChange(newValue);
    
    // Trigger typing animation
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 200);
  };

  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;

  const showFloatingLabel = isFocused || hasValue;
  const isErrorOrSuccess = error || success;

  // Determine border color based on state
  const borderColor = error ? 'var(--status-error)' : success ? 'var(--status-success)' : (isFocused ? 'var(--primary)' : 'var(--border-color)');
  const labelColor = error ? 'var(--status-error)' : success ? 'var(--status-success)' : (isFocused ? 'var(--primary)' : 'var(--text-muted)');

  return (
    <div className="relative w-full group">
      <label
        htmlFor={id}
        className={`absolute left-4 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none
          ${showFloatingLabel
            ? '-top-3 text-xs px-2 bg-[var(--surface-elevated)] rounded-md left-3 z-10'
            : 'top-1/2 -translate-y-1/2 left-4'}
          ${error ? 'text-[var(--status-error)]' : success ? 'text-[var(--status-success)]' : (isFocused ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]')}
        `}
        style={{ color: labelColor }}
      >
        {label}
      </label>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={handleTextChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isFocused && !hasValue ? placeholder : ''}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          className={`w-full p-4 rounded-[var(--ui-radius)] border-[var(--ui-border-width)] outline-none transition-all duration-300 ease-out resize-y
            bg-[var(--surface-elevated)] text-[var(--text-primary)]
            focus:ring-4 focus:ring-[var(--primary)]/10
            ${error ? 'border-[var(--status-error)]' : success ? 'border-[var(--status-success)]' : 'border-[var(--border-color)]'}
            ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
            ${isTyping ? 'input-typing' : ''}
            shadow-[var(--ui-shadow)] focus:shadow-[var(--ui-shadow-elevated)]
          `}
          style={{ borderColor: borderColor }}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={handleTextChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isFocused && !hasValue ? placeholder : ''} 
          disabled={disabled}
          maxLength={maxLength}
          className={`w-full h-14 p-4 rounded-[var(--ui-radius)] border-[var(--ui-border-width)] outline-none transition-all duration-300 ease-out
            bg-[var(--surface-elevated)] text-[var(--text-primary)]
            focus:ring-4 focus:ring-[var(--primary)]/10
            ${error ? 'border-[var(--status-error)]' : success ? 'border-[var(--status-success)]' : 'border-[var(--border-color)]'}
            ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
            ${isTyping ? 'input-typing' : ''}
            shadow-[var(--ui-shadow)] focus:shadow-[var(--ui-shadow-elevated)]
          `}
          style={{ borderColor: borderColor }}
        />
      )}
      {(error || success) && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
          {error && <MagicIcon icon={AlertCircle} size={18} color="var(--status-error)" variant="duotone" />}
          {success && <MagicIcon icon={CheckCircle2} size={18} color="var(--status-success)" variant="duotone" />}
        </div>
      )}
      {error && errorMessage && (
        <p className="text-[var(--status-error)] text-xs mt-1 ml-4">{errorMessage}</p>
      )}
    </div>
  );
};
