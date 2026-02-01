import { Checkbox, FormControlLabel } from "@mui/material"
import { colors } from "@/utils/colors"

const AgreementCheckbox = ({ checked, onChange, children }) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={onChange}
          sx={{
            color: colors.red[700],
            "&.Mui-checked": {
              color: colors.red[700],
            },
          }}
        />
      }
      label={<span className="text-sm text-gray-600">{children}</span>}
      sx={{ alignItems: "center" }}
    />
  )
}

export default AgreementCheckbox
