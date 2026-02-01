import React from "react"
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Chip,
} from "@mui/material"
import { colors } from "@/utils/colors"

const CategorySelect = ({ value, onChange, options, t }) => {
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

  return (
    <Box>
      <Typography variant="overline" display="block" gutterBottom>
        {t.rooms.createRoom.categoriesLabel}
      </Typography>
      <FormControl fullWidth sx={inputColorSx}>
        <Select
          labelId="category-select-label"
          multiple
          displayEmpty
          value={value}
          onChange={onChange}
          inputProps={{ MenuProps: { disableScrollLock: true } }}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return (
                <span style={{ color: "#aaa" }}>
                  {t.rooms.createRoom.categoriesLabel}
                </span>
              )
            }
            return (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((val) => (
                  <Chip
                    key={val}
                    label={
                      t.rooms.createRoom.categories[val.toLowerCase()] || val
                    }
                    size="small"
                  />
                ))}
              </Box>
            )
          }}
        >
          {options.map((category) => (
            <MenuItem
              key={category}
              value={category}
              disabled={value.length >= 3 && !value.includes(category)}
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
              {t.rooms.createRoom.categories[category.toLowerCase()] ||
                category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  )
}

export default CategorySelect
