import React, { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import { AnimatePresence } from "framer-motion"
import { FluentAnimation } from "@/shared/animations"

const FilterDropdown = ({ label, options = [], onSelect }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (option) => {
    setSelected(option)
    setIsOpen(false)
    if (onSelect) onSelect(option)
  }

  // Clear selection if the same property is tapped again
  const handleToggle = (e) => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-white font-bold text-sm border hover:bg-gray-50 transition min-w-[140px] justify-between ${
          selected
            ? "border-[#990011] text-[#990011]"
            : "border-gray-200 text-black"
        }`}
      >
        <span className="truncate">{selected ? selected.label : label}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${selected ? "text-[#990011]" : "text-gray-500"} ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="absolute z-50 mt-2 min-w-[180px] w-full origin-top-left pointer-events-none">
            <FluentAnimation
              direction="down"
              exit={true}
              className="pointer-events-auto rounded-xl bg-white shadow-lg border border-gray-100 ring-1 ring-black ring-opacity-5 overflow-hidden"
            >
              <div className="py-1">
                {options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(option)}
                    className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                      selected?.value === option.value
                        ? "bg-red-50 text-[#990011] font-semibold"
                        : "text-gray-700 font-medium"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
                {/* Added Clear option if something is selected */}
                {selected && (
                  <button
                    onClick={() => handleSelect(null)}
                    className="block w-full text-left px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100 font-medium"
                  >
                    Clear selection
                  </button>
                )}
              </div>
            </FluentAnimation>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FilterDropdown
