"use client";

import React from "react";

interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  endAdornment?: React.ReactNode;
  hideErrorMessage?: boolean;
}

export const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ label, error, id, className, endAdornment, value, hideErrorMessage, ...props }, forwardedRef) => {
    const generatedId = React.useId();
    const inputId = id || `field-${generatedId}`;
    const errorId = `${inputId}-error`;
    const internalRef = React.useRef<HTMLInputElement | null>(null);
    const [isAutofilled, setIsAutofilled] = React.useState(false);
    const ariaDescribedBy = [props["aria-describedby"], error && !hideErrorMessage ? errorId : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

    React.useEffect(() => {
      const checkAutofill = () => {
        try {
          setIsAutofilled(Boolean(internalRef.current?.matches(":-webkit-autofill")));
        } catch {
          setIsAutofilled(false);
        }
      };
      checkAutofill();
      const timer = window.setTimeout(checkAutofill, 100);
      return () => window.clearTimeout(timer);
    }, [value]);

    const hasValue = value !== "" && value !== undefined && value !== null;
    const isDateType = props.type === "date" || props.type === "time" || props.type === "datetime-local";
    const shouldFloat = hasValue || isAutofilled || isDateType;

    return (
      <div className="w-full">
        <div className="group relative">
          <input
            {...props}
            id={inputId}
            ref={(node) => {
              internalRef.current = node;
              if (typeof forwardedRef === "function") forwardedRef(node);
              else if (forwardedRef) forwardedRef.current = node;
            }}
            value={value}
            placeholder=" "
            aria-invalid={error ? true : props["aria-invalid"]}
            aria-describedby={ariaDescribedBy}
            className={`peer relative z-10 w-full rounded-md border-0 bg-transparent px-3 py-3 text-white shadow-none outline-none placeholder:text-transparent focus:border-0 focus:outline-none focus:ring-0 ${className || ""}`}
          />
          <fieldset
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 -top-2.5 rounded-md border px-2 transition-colors peer-focus:border-2 peer-focus:border-orange-500 ${error ? "border-orange-500" : "border-white/15"}`}
          >
            <legend className={`block h-0 w-auto whitespace-nowrap text-xs transition-all duration-300 ${shouldFloat ? "max-w-full px-1" : "hidden max-w-0 px-0"} peer-focus:block peer-focus:max-w-full peer-focus:px-1`}>
              <span className="text-xs opacity-0">{label}</span>
            </legend>
          </fieldset>
          <label
            htmlFor={inputId}
            className={`pointer-events-none absolute px-1 transition-all duration-300 ${shouldFloat ? "-top-[15px] left-2 bg-[#16031a] text-xs text-orange-500" : "left-3 top-3 text-sm text-white/50"} peer-focus:-top-[15px] peer-focus:left-2 peer-focus:bg-[#16031a] peer-focus:text-xs peer-focus:text-orange-500 ${error ? "text-orange-500" : ""}`}
          >
            {label}
          </label>
          {endAdornment}
        </div>
        {error && !hideErrorMessage ? (
          <p id={errorId} role="alert" className="mt-2 text-xs text-orange-500">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

FloatingLabelInput.displayName = "FloatingLabelInput";
