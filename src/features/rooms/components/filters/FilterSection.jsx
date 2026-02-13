import React from "react"
import { Box, Typography } from "@mui/material"

const FilterSection = ({ heading, children }) => {
  return (
    <Box>
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: "bold",
          textTransform: "uppercase",
          fontSize: { xs: "0.875rem", sm: "1rem" },
          mb: 1,
        }}
      >
        {heading}
      </Typography>
      <Box className="flex flex-col">{children}</Box>
    </Box>
  )
}

export default FilterSection
