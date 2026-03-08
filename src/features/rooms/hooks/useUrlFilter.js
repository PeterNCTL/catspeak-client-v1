import { useSearchParams } from "react-router-dom"
import { useMemo, useCallback } from "react"

export const useUrlFilter = (paramName) => {
  const [searchParams, setSearchParams] = useSearchParams()

  const currentValues = useMemo(() => {
    const paramStr = searchParams.get(paramName)
    return paramStr ? paramStr.split(",").map((s) => s.trim()) : []
  }, [searchParams, paramName])

  const toggleValue = useCallback(
    (value, isChecked) => {
      const newParams = new URLSearchParams(searchParams)

      let newValues = [...currentValues]
      if (isChecked) {
        if (!newValues.includes(value)) {
          newValues.push(value)
        }
      } else {
        newValues = newValues.filter((v) => v !== value)
      }

      if (newValues.length > 0) {
        newParams.set(paramName, newValues.join(","))
      } else {
        newParams.delete(paramName)
      }

      newParams.set("page", "1")
      setSearchParams(newParams, { preventScrollReset: true })
    },
    [searchParams, currentValues, paramName, setSearchParams],
  )

  const isSelected = useCallback(
    (value) => {
      return currentValues.includes(value)
    },
    [currentValues],
  )

  return {
    currentValues,
    toggleValue,
    isSelected,
  }
}
