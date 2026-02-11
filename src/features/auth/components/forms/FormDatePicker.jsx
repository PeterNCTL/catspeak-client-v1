import { Box, Typography, TextField } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { colors } from "@/shared/utils/colors"
import dayjs from "dayjs"

const FormDatePicker = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  helperText,
}) => {
  const handleDateChange = (newValue) => {
    const formattedDate = newValue ? dayjs(newValue).format("YYYY-MM-DD") : ""
    onChange({
      target: {
        value: formattedDate,
        type: "text",
      },
    })
  }

  return (
    <Box>
      <Typography
        display="block"
        gutterBottom
        sx={{ fontWeight: 700, fontSize: "0.875rem" }}
      >
        {label}
      </Typography>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          value={value ? dayjs(value) : null}
          onChange={handleDateChange}
          enableAccessibleFieldDOMStructure={false}
          slots={{ textField: TextField }} // ✅ IMPORTANT
          slotProps={{
            textField: {
              fullWidth: true,
              placeholder,
              error,
              helperText,
              sx: {
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
              },
            },
            day: {
              sx: {
                // hover for normal days
                "&:hover": {
                  backgroundColor: `${colors.red[700]}22`,
                },

                // selected day
                "&.MuiPickersDay-root.Mui-selected": {
                  backgroundColor: colors.red[700],
                  color: "#fff",

                  // keep selected red on hover
                  "&:hover": {
                    backgroundColor: colors.red[700],
                  },
                },
              },
            },
            yearButton: {
              sx: {
                "&.MuiYearCalendar-button.Mui-selected": {
                  backgroundColor: colors.red[700],
                  color: "#fff",
                },
                "&.MuiYearCalendar-button.Mui-selected:hover": {
                  backgroundColor: colors.red[700],
                },
                // optional: hover color for non-selected
                "&:hover": {
                  backgroundColor: `${colors.red[700]}22`,
                },
              },
            },
          }}
        />
      </LocalizationProvider>
    </Box>
  )
}

export default FormDatePicker
