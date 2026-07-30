"use client";

import { ChevronDown } from "lucide-react";
import React from "react";

export interface FloatingLabelSelectOption {
  value: string;
  label: string;
}

interface FloatingLabelSelectProps {
  label: string;
  error?: string;
  id?: string;
  name?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: FloatingLabelSelectOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}

export const FloatingLabelSelect = React.forwardRef<HTMLSelectElement, FloatingLabelSelectProps>(
  ({ label, error, id, name, className, value = "", onChange, options, placeholder, disabled, required }, ref) => {
    const generatedId = React.useId();
    const selectId = id || `select-${generatedId}`;
    const errorId = `${selectId}-error`;

    return (
      <div className={`w-full ${className || ""}`}>
        <div className="group relative">
          <select
            ref={ref}
            id={selectId}
            name={name || id}
            value={value}
            disabled={disabled}
            required={required}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            onChange={(event) => onChange?.(event.target.value)}
            className="peer relative z-10 w-full appearance-none rounded-md border border-white/15 bg-transparent px-3 pb-3 pt-4 text-white outline-none transition focus:border-2 focus:border-crimson-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {placeholder ? <option value="" className="bg-[#1a1a1a]">{placeholder}</option> : null}
            {options.map((option) => (
              <option key={option.value} value={option.value} className="bg-[#1a1a1a] text-white">
                {option.label}
              </option>
            ))}
          </select>
          <label htmlFor={selectId} className="absolute -top-[9px] left-2 z-20 bg-[#16031a] px-1 text-xs text-crimson-500">
            {label}
          </label>
          <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 z-20 h-5 w-5 -translate-y-1/2 text-white/50" />
        </div>
        {error ? <p id={errorId} role="alert" className="mt-2 text-xs text-crimson-500">{error}</p> : null}
      </div>
    );
  },
);

FloatingLabelSelect.displayName = "FloatingLabelSelect";
