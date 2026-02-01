import { Box, Typography } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { colors } from "@/utils/colors"
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
          slotProps={{
            textField: {
              fullWidth: true,
              placeholder: placeholder,
              error: error,
              helperText: helperText,
              InputProps: {
                style: {
                  borderRadius: "50px",
                },
              },
              sx: {
                "& .MuiOutlinedInput-root": {
                  borderRadius: "50px !important",
                  "& fieldset": {
                    borderColor: `${colors.border} !important`,
                    borderRadius: "50px !important",
                  },
                  "&:hover fieldset": {
                    borderColor: `${colors.red[700]} !important`,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: `${colors.red[700]} !important`,
                  },
                  "&.Mui-error fieldset": {
                    borderColor: `${colors.danger} !important`,
                  },
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
