import { Box, Typography, FormControl, Select, MenuItem } from "@mui/material"
import { colors } from "@/shared/utils/colors"

const inputColorSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "50px",
    "& fieldset": {
      borderColor: colors.border,
    },
    "&:hover fieldset": {
      borderColor: colors.red[700],
    },
    "&.Mui-focused fieldset": {
      borderColor: colors.red[700],
    },
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: colors.red[700],
  },
}

const FormSelectField = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  errorText,
  options,
}) => {
  return (
    <Box sx={{ flex: 1 }}>
      <Typography
        display="block"
        gutterBottom
        sx={{ fontWeight: 700, fontSize: "0.875rem" }}
      >
        {label}
      </Typography>
      <FormControl fullWidth sx={inputColorSx}>
        <Select
          value={value}
          onChange={onChange}
          displayEmpty
          error={error}
          inputProps={{ MenuProps: { disableScrollLock: true } }}
          sx={{
            "& .MuiSelect-select": {
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            },
          }}
          renderValue={(selected) => {
            if (!selected) {
              return <span style={{ color: "#aaa" }}>{placeholder}</span>
            }
            const option = options.find((opt) => opt.value === selected)
            return option ? option.label : selected
          }}
        >
          {options.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "rgba(153, 0, 17, 0.1)",
                  color: colors.red[700],
                  "&:hover": {
                    backgroundColor: "rgba(153, 0, 17, 0.2)",
                  },
                },
                "&.Mui-selected.Mui-focusVisible": {
                  backgroundColor: "rgba(153, 0, 17, 0.2)",
                },
                "&:hover": {
                  backgroundColor: "rgba(153, 0, 17, 0.05)",
                  color: colors.red[700],
                },
              }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {errorText && (
          <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
            {errorText}
          </Typography>
        )}
      </FormControl>
    </Box>
  )
}

export default FormSelectField
