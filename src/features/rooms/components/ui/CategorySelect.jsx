import React from "react"
import { colors } from "@/shared/utils/colors"

const CategorySelect = ({ value, onChange, options, t }) => {
  const handleSelect = (category) => {
    let newCategories
    if (value.includes(category)) {
      newCategories = value.filter((c) => c !== category)
    } else {
      if (value.length >= 3) return
      newCategories = [...value, category]
    }
    // Pass the new array directly to match parent's generic handler or custom event
    onChange({ target: { value: newCategories } })
  }

  return (
    <div className="text-left">
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {t.rooms.createRoom.categoriesLabel}
      </label>
      <div
        className="flex flex-wrap justify-start gap-2"
        style={{ "--border-color": colors.border }}
      >
        {options.map((category) => {
          const isSelected = value.includes(category)
          const isDisabled = !isSelected && value.length >= 3

          return (
            <button
              key={category}
              type="button"
              onClick={() => !isDisabled && handleSelect(category)}
              disabled={isDisabled}
              className={`inline-flex h-12 items-center rounded-full px-4 text-sm border transition-colors ${
                isSelected
                  ? "bg-cath-red-700 border-cath-red-700 text-white hover:bg-cath-red-800 hover:border-cath-red-800"
                  : "border-[var(--border-color)] hover:bg-gray-100"
              } ${isDisabled ? "cursor-not-allowed opacity-50" : ""}`}
            >
              {t.rooms.createRoom.categories[category.toLowerCase()] ||
                category}
            </button>
          )
        })}
      </div>
      <p
        className={`mt-1 text-xs transition-opacity `}
        style={{ color: colors.subtext }}
      >
        {t.rooms.createRoom.categoryLimit}
      </p>
    </div>
  )
}

export default CategorySelect
