import React from "react";

interface FloatingLabelTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hideErrorMessage?: boolean;
}

export const FloatingLabelTextArea = React.forwardRef<HTMLTextAreaElement, FloatingLabelTextAreaProps>(
  ({ label, error, id, className, value, hideErrorMessage, ...props }, ref) => {
    const [isAutofilled, setIsAutofilled] = React.useState(false);

    // Determine if the input has a value to control the label state explicitly
    const hasValue = value !== "" && value !== undefined && value !== null;
    const shouldFloat = hasValue || isAutofilled;

    return (
      <div className="w-full">
        <div className="relative group">
          <textarea
            id={id}
            ref={ref}
            value={value}
            placeholder=" "
            style={{
              border: 'none',
              outline: 'none',
              boxShadow: 'none',
            }}
            className={`peer w-full bg-transparent rounded-md px-3 py-3 text-white placeholder-transparent 
                     focus:outline-none focus:ring-0 focus:border-0 z-10 relative
                     border-0! outline-none! ring-0! shadow-none! resize-none
                     ${className}`}
            {...props}
          />
          <fieldset
            aria-hidden="true"
            className={`absolute inset-0 -top-2.5 border rounded-md pointer-events-none 
                     peer-focus:border-orange-500 peer-focus:border-2 
                     transition-colors px-2
                     ${error ? "border-orange-500" : "border-white/15"}`}
          >
            <legend
              className={`block w-auto text-xs transition-all duration-300 whitespace-nowrap
                       ${shouldFloat ? "max-w-full px-1 h-0" : "max-w-0 px-0 h-0 hidden"}
                       peer-focus:max-w-full peer-focus:px-1 peer-focus:h-0 peer-focus:block`}
            >
              <span className="opacity-0 text-xs">{label}</span>
            </legend>
          </fieldset>
          <label
            htmlFor={id}
            className={`absolute transition-all duration-300 pointer-events-none px-1
                     ${shouldFloat ? "-top-[15px] left-2 text-xs text-orange-500 bg-[#16031a]" : "top-3 left-3 text-sm text-white/50"}
                     peer-focus:-top-[15px] peer-focus:left-2 peer-focus:text-xs peer-focus:text-orange-500 peer-focus:bg-[#16031a]
                     ${error ? "text-orange-500" : ""}`}
          >
            {label}
          </label>
        </div>
        {error && !hideErrorMessage && <p className="text-xs text-orange-500 mt-2">{error}</p>}
      </div>
    );
  }
);

FloatingLabelTextArea.displayName = "FloatingLabelTextArea";