// src/app/(components)/ui/FloatingLabelSelect.tsx
"use client";

import React from "react";
import { ChevronDown, X } from "lucide-react";

export interface FloatingLabelSelectOption {
  value: string;
  label: string;
}

interface FloatingLabelSelectProps {
  label: string;
  error?: string;
  id?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
  options: FloatingLabelSelectOption[];
  placeholder?: string;
  disabled?: boolean;
}

export const FloatingLabelSelect = React.forwardRef<HTMLDivElement, FloatingLabelSelectProps>(
  ({ label, error, id, className, value, onChange, options, placeholder, disabled }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(value || "");
    const [searchQuery, setSearchQuery] = React.useState("");
    const containerRef = React.useRef<HTMLDivElement>(null);
    const comboboxRef = React.useRef<HTMLDivElement>(null);
    const hasValue = selectedValue !== "" && selectedValue !== undefined && selectedValue !== null;

    // Get selected option label
    const selectedOption = options.find(opt => opt.value === selectedValue);

    // Display search query while typing, otherwise show selected value
    const displayValue = searchQuery
      ? searchQuery
      : (selectedOption?.label || placeholder || "");

    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setSearchQuery("");
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen]);

    // Sync internal state with external value
    React.useEffect(() => {
      if (value !== undefined) {
        setSelectedValue(value);
      }
    }, [value]);

    const handleToggle = () => {
      if (!disabled) {
        if (!isOpen && hasValue) {
          // Clear the selected value when opening dropdown on a selected item
          setSelectedValue("");
          onChange?.("");
        }
        setIsOpen(!isOpen);
      }
    };

    const handleClearSearch = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSearchQuery("");
      // Keep dropdown open and refocus the field so user can continue typing
      if (!isOpen) {
        setIsOpen(true);
      }
      // Focus the combobox so user can immediately start typing
      setTimeout(() => {
        comboboxRef.current?.focus();
      }, 0);
    };

    const handleSelect = (optionValue: string) => {
      setSelectedValue(optionValue);
      setIsOpen(false);
      setSearchQuery("");
      onChange?.(optionValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;

      if (e.key === "Enter") {
        e.preventDefault();
        setIsOpen(!isOpen);
      } else if (e.key === " " && !isOpen) {
        // Only use space to toggle when dropdown is closed
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === "Escape") {
        setIsOpen(false);
        setSearchQuery("");
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
      } else if (e.key === "Backspace") {
        // Allow backspace to delete search query
        e.preventDefault();
        setSearchQuery(searchQuery.slice(0, -1));

        // Open dropdown if closed
        if (!isOpen) {
          setIsOpen(true);
        }
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        // Keyboard search: type to find (including spaces when dropdown is open)
        e.preventDefault();
        const newQuery = searchQuery + e.key;
        setSearchQuery(newQuery);

        // Open dropdown if closed
        if (!isOpen) {
          setIsOpen(true);
        }
      }
    };

    // Filter options based on search query
    const filteredOptions = searchQuery
      ? options.filter(opt => opt.label.toLowerCase().includes(searchQuery.toLowerCase()))
      : options;

    return (
      <div ref={containerRef} className={`relative group ${className || ""}`}>
        {/* Hidden input for form compatibility */}
        <input type="hidden" name={id} value={selectedValue} />

        {/* Custom select trigger */}
        <div
          ref={(node) => {
            // Handle both refs: the forwarded ref and our internal ref
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            comboboxRef.current = node;
          }}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={`${id}-listbox`}
          tabIndex={disabled ? -1 : 0}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          style={{
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
          }}
          className={`peer w-full bg-transparent rounded-md px-3 py-3 pr-10 text-white z-10 relative cursor-pointer
                     border-0! outline-none! ring-0! shadow-none! focus:outline-none
                     ${!hasValue && !searchQuery ? "text-transparent" : "text-white"}
                     ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <span className={!hasValue && !searchQuery ? "text-transparent" : "text-white"}>
            {displayValue}
          </span>
        </div>

        {/* Clear search button (X) - only show when typing */}
        {searchQuery && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-10 top-1/2 -translate-y-1/2 z-20 text-white/50 hover:text-crimson-500 transition-colors p-1"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Custom dropdown arrow */}
        <div className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none z-20 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
          <ChevronDown
            className={`w-5 h-5 transition-colors duration-300 ${isOpen ? "text-crimson-500" : "text-white/50"}`}
          />
        </div>

        {/* Dropdown menu */}
        {isOpen && (
          <div
            id={`${id}-listbox`}
            role="listbox"
            className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a] border border-white/15 rounded-md shadow-lg z-50 max-h-60 overflow-auto"
          >
            {/* Filtered options */}
            {filteredOptions.map((option) => {
              // Highlight matching text
              const label = option.label;
              const queryLower = searchQuery.toLowerCase();
              const labelLower = label.toLowerCase();
              const matchIndex = labelLower.indexOf(queryLower);

              let displayLabel: React.ReactNode = label;
              if (searchQuery && matchIndex !== -1) {
                const before = label.slice(0, matchIndex);
                const match = label.slice(matchIndex, matchIndex + searchQuery.length);
                const after = label.slice(matchIndex + searchQuery.length);
                displayLabel = (
                  <>
                    {before}
                    <span className="bg-crimson-500/30 text-crimson-400 font-semibold">{match}</span>
                    {after}
                  </>
                );
              }

              return (
                <div
                  key={option.value}
                  role="option"
                  aria-selected={selectedValue === option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`px-3 py-2.5 cursor-pointer transition-colors
                    ${selectedValue === option.value
                      ? "bg-crimson-500/20 text-crimson-500"
                      : "text-white hover:bg-crimson-500/10"
                    }`}
                >
                  {displayLabel}
                </div>
              );
            })}

            {/* No results message */}
            {searchQuery && filteredOptions.length === 0 && (
              <div className="px-3 py-4 text-center text-white/50 text-sm">
                No matches found for "{searchQuery}"
              </div>
            )}
          </div>
        )}

        {/* Fieldset border */}
        <fieldset aria-hidden="true" className={`absolute inset-0 -top-2.5 border rounded-md pointer-events-none
                     peer-focus:border-crimson-500 peer-focus:border-2
                     ${isOpen ? "border-crimson-500 border-2" : ""}
                     ${!isOpen && error ? "border-crimson-500" : !isOpen ? "border-white/15" : ""}
                     transition-colors px-2`}
        >
          <legend className={`block w-auto text-xs transition-all duration-300 whitespace-nowrap
                       ${hasValue || isOpen || searchQuery ? "max-w-full px-1 h-0" : "max-w-0 px-0 h-0 hidden"}
                       ${isOpen ? "max-w-full px-1 h-0 block" : ""}`}
          >
            <span className="opacity-0 text-xs">{label}</span>
          </legend>
        </fieldset>

        {/* Floating label */}
        <label
          htmlFor={id}
          onClick={handleToggle}
          className={`absolute transition-all duration-300 px-1 cursor-pointer
                     ${hasValue || isOpen || searchQuery
              ? "-top-[15px] left-2 text-xs text-crimson-500 bg-[#16031a]"
              : "top-2.5 left-3 text-sm text-white/50 pointer-events-none"
            }
                     ${error ? "text-crimson-500" : ""}`}
        >
          {label}
        </label>

        {/* Error message */}
        {error && <p className="text-xs text-crimson-500 mt-2">{error}</p>}
      </div>
    );
  }
);

FloatingLabelSelect.displayName = "FloatingLabelSelect";
