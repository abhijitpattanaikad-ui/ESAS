"use client";

import React from "react";
import { countries } from "@/data/countries";
import { FloatingLabelInput } from "./FloatingLabelInput";

interface FloatingLabelPhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  countryCode: string;
  onCountryChange: (code: string) => void;
  error?: string;
}

export const FloatingLabelPhoneInput = React.forwardRef<HTMLInputElement, FloatingLabelPhoneInputProps>(
  ({ label, value, onChange, countryCode, onCountryChange, error, className, id, ...props }, ref) => {
    const generatedId = React.useId();
    const phoneId = id || `phone-${generatedId}`;
    const errorId = `${phoneId}-error`;

    return (
      <div className={`flex flex-col ${className || ""}`}>
        <div className="flex items-start gap-2">
          <div className="relative min-w-[124px]">
            <label htmlFor={`${phoneId}-country`} className="sr-only">Country calling code</label>
            <select
              id={`${phoneId}-country`}
              aria-label="Country calling code"
              value={countryCode}
              onChange={(event) => onCountryChange(event.target.value)}
              className={`h-12 w-full rounded-md border bg-transparent px-3 text-sm text-white outline-none transition focus:border-2 focus:border-orange-500 ${error ? "border-orange-500" : "border-white/15"}`}
            >
              {countries.map((country) => (
                <option key={`${country.code}-${country.dial_code}`} value={country.dial_code} className="bg-[#1a1a1a] text-white">
                  {country.code} {country.dial_code}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <FloatingLabelInput
              {...props}
              id={phoneId}
              ref={ref}
              label={label}
              value={value}
              onChange={onChange}
              error={error}
              type="tel"
              inputMode="tel"
              hideErrorMessage
              aria-describedby={error ? errorId : props["aria-describedby"]}
              aria-invalid={error ? true : props["aria-invalid"]}
            />
          </div>
        </div>
        {error ? <p id={errorId} role="alert" className="mt-2 text-xs text-crimson-500">{error}</p> : null}
      </div>
    );
  },
);

FloatingLabelPhoneInput.displayName = "FloatingLabelPhoneInput";
