const LanguageMenuItem = ({
  code,
  label,
  flag,
  disabled,
  onSelect,
  soonLabel,
}) => (
  <button
    disabled={disabled}
    onClick={(e) => {
      if (disabled) e.preventDefault()
      else onSelect(code, label)
    }}
    className={`flex w-full items-center gap-3 px-4 py-2 text-sm transition-all duration-200 rounded-lg whitespace-nowrap ${
      disabled
        ? "cursor-not-allowed opacity-60 hover:bg-transparent"
        : "hover:bg-gray-100 cursor-pointer text-gray-700 hover:text-gray-900 mx-1 my-0.5"
    } ${disabled ? "" : "hover:shadow-sm"}`}
  >
    <div className="flex-shrink-0">
      <img
        src={flag}
        alt={label}
        className={`h-6 w-6 rounded-full object-cover shadow-sm ${
          disabled ? "grayscale opacity-50" : ""
        }`}
      />
    </div>
    {disabled ? (
      <div className="flex w-full items-center justify-between text-gray-400">
        <span className="font-medium">{label}</span>
        <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-gray-400/80 border border-gray-200">
          {soonLabel}
        </span>
      </div>
    ) : (
      <span className="font-semibold tracking-wide">{label}</span>
    )}
  </button>
)

export default LanguageMenuItem
