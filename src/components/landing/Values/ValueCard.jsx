import { Typography, Paper } from "@mui/material"

const ValueCard = ({ icon, title, description, className = "" }) => {
  return (
    <Paper
      elevation={3}
      className={`relative z-10 flex w-full max-w-[280px] flex-col gap-3 rounded-[24px] p-6 transition-transform ${className}`}
      sx={{
        borderRadius: "24px",
      }}
    >
      <div className="flex items-center gap-4">
        {icon && <div className="text-cath-orange-500">{icon}</div>}
      </div>

      <div className="flex flex-col gap-2">
        <Typography
          variant="h6"
          className="font-bold leading-tight text-gray-900"
        >
          {title}
        </Typography>
        <Typography variant="body2" className="text-gray-600">
          {description}
        </Typography>
      </div>
    </Paper>
  )
}

export default ValueCard
