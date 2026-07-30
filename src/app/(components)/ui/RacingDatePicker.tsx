"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";

interface RacingDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  name?: string;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function RacingDatePicker({ value, onChange, label, name }: RacingDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(value ? new Date(value) : new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync viewDate when value changes
  useEffect(() => {
    if (value) {
      setViewDate(new Date(value));
    }
  }, [value]);

  const toggleOpen = () => setIsOpen(!isOpen);

  const handleDateSelect = (day: number) => {
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    // Format as YYYY-MM-DD for consistency with native date inputs
    const formattedDate = newDate.toISOString().split('T')[0];
    onChange(formattedDate);
    setIsOpen(false);
  };

  const changeMonth = (offset: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
  };

  const changeYear = (year: number) => {
    setViewDate(new Date(year, viewDate.getMonth(), 1));
  };

  // Calendar logic
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  // Year selection logic (current year down to 1920)
  const years = Array.from({ length: 101 }, (_, i) => new Date().getFullYear() - i);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative group" ref={containerRef}>
      {label && (
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      )}
      
      <div 
        onClick={toggleOpen}
        className={clsx(
          "w-full flex items-center justify-between text-base font-bold text-white bg-white/[0.03] border border-white/[0.05] rounded-xl px-4 py-2.5 cursor-pointer transition-all hover:bg-white/[0.06]",
          isOpen ? "border-[#FE1801]/50 shadow-[0_0_15px_rgba(254,24,1,0.2)]" : "focus-within:border-[#FE1801]/30"
        )}
      >
        <span className={clsx(!value && "text-gray-600")}>
          {value || "Select Date"}
        </span>
        <CalendarIcon className={clsx("w-5 h-5 transition-colors", isOpen ? "text-[#FE1801]" : "text-gray-500")} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-[100] left-0 mt-2 w-72 bg-[#0B0F19]/95 backdrop-blur-3xl border border-[#FE1801]/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(254,24,1,0.15)] overflow-hidden"
          >
            {/* Racing HUD Stripe */}
            <div className="absolute top-0 left-0 w-1 h-full bg-[#FE1801] opacity-50" />
            <div className="absolute top-0 right-0 w-px h-full bg-white/5" />

            {/* Header / Month-Year Selector */}
            <div className="p-4 border-b border-white/5 bg-gradient-to-r from-[#FE1801]/10 to-transparent">
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex flex-col items-center">
                  <span className="text-xs font-orbitron font-black italic uppercase text-[#FE1801] tracking-widest">
                    {MONTHS[viewDate.getMonth()]}
                  </span>
                  <select 
                    value={viewDate.getFullYear()} 
                    onChange={(e) => changeYear(parseInt(e.target.value))}
                    className="bg-transparent text-lg font-black font-orbitron italic text-white outline-none cursor-pointer appearance-none text-center"
                  >
                    {years.map(y => <option key={y} value={y} className="bg-[#0B0F19]">{y}</option>)}
                  </select>
                </div>

                <button onClick={() => changeMonth(1)} className="p-1 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Weekdays */}
              <div className="grid grid-cols-7 text-[10px] font-black font-orbitron text-gray-500 uppercase text-center tracking-tighter">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <span key={d}>{d}</span>)}
              </div>
            </div>

            {/* Days Grid */}
            <div className="p-4 grid grid-cols-7 gap-1">
              {emptyDays.map(i => <div key={`empty-${i}`} />)}
              {days.map(day => {
                const isSelected = value && new Date(value).getDate() === day && new Date(value).getMonth() === viewDate.getMonth() && new Date(value).getFullYear() === viewDate.getFullYear();
                const isToday = new Date().getDate() === day && new Date().getMonth() === viewDate.getMonth() && new Date().getFullYear() === viewDate.getFullYear();
                
                return (
                  <button
                    key={day}
                    onClick={() => handleDateSelect(day)}
                    className={clsx(
                      "aspect-square flex items-center justify-center text-sm font-bold rounded-lg transition-all relative group/day",
                      isSelected 
                        ? "bg-[#FE1801] text-white shadow-[0_0_15px_rgba(254,24,1,0.5)]" 
                        : "text-gray-400 hover:bg-white/10 hover:text-white",
                      isToday && !isSelected && "border border-[#FE1801]/30"
                    )}
                  >
                    {day}
                    {isToday && !isSelected && (
                      <div className="absolute bottom-1 w-1 h-1 bg-[#FE1801] rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer decoration */}
            <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#FE1801]/30 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
