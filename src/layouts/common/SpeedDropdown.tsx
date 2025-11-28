import { ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface SpeedDropdownProps {
  value: number;
  onChange: (value: number) => void;
}

export function SpeedDropdown({ value, onChange }: SpeedDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const speeds = [0.5, 0.75, 1, 1.25, 1.5];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-20 bg-white border-2 border-blue-500 rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
      >
        <span>{value}x</span>
        <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-20 bg-white border-2 border-blue-500 rounded-lg shadow-lg overflow-hidden z-10">
          {speeds.map((speed) => (
            <button
              key={speed}
              onClick={() => {
                onChange(speed);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2.5 text-sm text-left hover:bg-blue-50 transition-colors ${
                speed === value ? 'bg-blue-500 text-white font-medium hover:bg-blue-600' : 'text-gray-700'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      )}
    </div>
  );
}