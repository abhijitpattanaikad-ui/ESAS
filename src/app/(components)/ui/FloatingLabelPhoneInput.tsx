"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { FloatingLabelInput } from "./FloatingLabelInput";
import { countries, Country } from "@/data/countries";

interface FloatingLabelPhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  countryCode: string;
  onCountryChange: (code: string) => void;
  error?: string;
}

export const FloatingLabelPhoneInput = React.forwardRef<HTMLInputElement, FloatingLabelPhoneInputProps>(
  ({ label, value, onChange, countryCode, onCountryChange, error, className, ...props }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Find selected country
    const selectedCountry = countries.find(c => c.dial_code === countryCode) || countries.find(c => c.code === "IN") || countries[0];

    // Filter countries
    const filteredCountries = countries.filter(country =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dial_code.includes(searchQuery) ||
      country.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setSearchQuery("");
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        // Focus search input when opened
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 100);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen]);

    const handleSelect = (country: Country) => {
      onCountryChange(country.dial_code);
      setIsOpen(false);
      setSearchQuery("");
    };

    return (
      <div className={`flex flex-col ${className || ""}`}>
        <div className="flex gap-2 items-start">
          {/* Country Selector */}
          <div className="relative group" ref={containerRef}>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={`peer py-3 px-3 bg-transparent rounded-md flex items-center gap-2 transition-colors min-w-[100px] z-10 relative
                            focus:outline-none`}
            >
              <img
                src={`https://flagcdn.com/w40/${selectedCountry.code.toLowerCase()}.png`}
                alt={selectedCountry.name}
                className="w-6 h-auto object-cover rounded-sm"
              />
              <span className="text-white">{selectedCountry.dial_code}</span>
              <ChevronDown className={`w-4 h-4 text-white/50 transition-transform cursor-pointer ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Fieldset border to match FloatingLabelInput */}
            <fieldset
              aria-hidden="true"
              className={`absolute inset-0 -top-2.5 border rounded-md pointer-events-none 
                        peer-focus:border-orange-500 peer-focus:border-2 
                        transition-colors px-2
                        ${error ? "border-orange-500" : "border-white/15"}`}
            >
              <legend className="block w-auto text-xs h-0 max-w-0 px-0 hidden">
                <span className="opacity-0 text-xs">Country</span>
              </legend>
            </fieldset>

            {/* Dropdown */}
            {isOpen && (
              <div className="absolute top-full left-0 mt-2 w-[300px] bg-[#1a1a1a] border border-white/15 rounded-md shadow-xl z-50 max-h-[300px] flex flex-col">
                {/* Search Header */}
                <div className="p-2 border-b border-white/10 sticky top-0 bg-[#1a1a1a] z-10">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search country..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded px-8 py-1.5 text-sm text-white focus:outline-none focus:border-orange-500 placeholder-white/30"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* List */}
                <div className="overflow-y-auto flex-1 custom-scrollbar">
                  {filteredCountries.map((country) => (
                    <button
                      key={`${country.code}-${country.dial_code}`}
                      type="button"
                      onClick={() => handleSelect(country)}
                      className={`w-full px-4 py-2 flex items-center gap-3 hover:bg-white/5 transition-colors text-left
                                        ${selectedCountry.code === country.code ? "bg-orange-500/10 text-orange-500" : "text-white/80"}`}
                    >
                      <img
                        src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`}
                        alt={country.name}
                        className="w-5 h-auto object-cover rounded-sm"
                      />
                      <span className="flex-1 text-sm truncate">{country.name}</span>
                      <span className="text-xs opacity-50">{country.dial_code}</span>
                    </button>
                  ))}
                  {filteredCountries.length === 0 && (
                    <div className="p-4 text-center text-white/40 text-sm">
                      No countries found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Phone Input */}
          <div className="flex-1">
            <FloatingLabelInput
              ref={ref}
              label={label}
              value={value}
              onChange={onChange}
              error={error}
              type="tel"
              hideErrorMessage={true}
              {...props}
            />
          </div>
        </div>
        {error && <p className="text-xs text-crimson-500 mt-2">{error}</p>}
      </div>
    );
  }
);

FloatingLabelPhoneInput.displayName = "FloatingLabelPhoneInput";
