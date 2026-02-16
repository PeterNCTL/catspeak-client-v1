import React from "react"
import { colors } from "@/shared/utils/colors"

const LevelSelector = ({ selectedLevel, onSelect, levels, t }) => {
  return (
    <div className="text-left">
      <label className="mb-2 block text-sm font-bold">
        {t.rooms.createRoom.requiredLevel}
      </label>
      <div
        className="flex flex-wrap justify-start gap-2"
        style={{ "--border-color": colors.border }}
      >
        {levels?.map((level) => {
          const isSelected = selectedLevel === level
          return (
            <button
              key={level}
              type="button"
              onClick={() => onSelect(isSelected ? "" : level)}
              className={`inline-flex h-12 items-center rounded-full px-4 text-sm border transition-colors ${
                isSelected
                  ? "bg-cath-red-700 border-cath-red-700 text-white hover:bg-cath-red-800 hover:border-cath-red-800"
                  : "border-[var(--border-color)] hover:bg-gray-100"
              }`}
            >
              {level}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default LevelSelector
