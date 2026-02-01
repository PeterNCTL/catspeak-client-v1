import React, { useState } from "react"
import { useLanguage } from "@/context/LanguageContext"
import { useGetProfileQuery } from "@/store/api/authApi"
import InDevelopmentModal from "@/components/common/InDevelopmentModal"
import { Typography, Switch, Box } from "@mui/material"

const WelcomeSection = ({ allowConnect, setAllowConnect }) => {
  const [isDevModalOpen, setIsDevModalOpen] = useState(false)
  const { t } = useLanguage()
  const { welcome } = t.rooms
  const { data: userData } = useGetProfileQuery()
  const user = userData?.data

  const handleSwitchChange = (event) => {
    const checked = event.target.checked
    if (checked) {
      // Trying to turn ON
      setIsDevModalOpen(true)
    } else {
      // Turning OFF
      setAllowConnect(false)
    }
  }

  return (
    <div className="relative pl-4 sm:pl-6 h-full">
      {/* Decorative connecting lines with rounded corners - Responsive */}
      <div className="absolute left-1 sm:left-2 top-3 sm:top-4 h-0.5 w-12 sm:w-20 bg-[#990011] rounded-r-full" />
      <div className="absolute left-1 sm:left-2 top-3 sm:top-4 h-[180px] sm:h-[220px] w-0.5 bg-[#990011] rounded-b-full" />

      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          mb: 0.5,
          ml: { xs: 6, sm: 10 },
          fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
        }}
      >
        {welcome.greeting.replace("{{name}}", user?.username || "Friend")}
      </Typography>

      {/* dynamic content starts here */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          color: "#990011",
          textShadow: "0 2px 6px rgba(0,0,0,0.15)",
          fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
        }}
      >
        Chúc Mừng Năm Mới
      </Typography>
      <Typography
        variant="body2"
        sx={{
          mt: 2,
          color: "text.secondary",
          lineHeight: 1.6,
          fontSize: { xs: "0.875rem", sm: "0.875rem" },
        }}
      >
        Tết Nguyên Đán là{" "}
        <Box component="span" sx={{ fontWeight: 600, color: "#990011" }}>
          lễ hội truyền thống
        </Box>{" "}
        lớn nhất của người Việt Nam. Đây là dịp để gia đình sum họp, tưởng nhớ
        tổ tiên và cùng nhau đón chào một{" "}
        <Box component="span" sx={{ fontWeight: 600, color: "#990011" }}>
          năm mới bình an
        </Box>{" "}
        và hạnh phúc.
      </Typography>
      <Typography
        variant="body2"
        sx={{
          mt: 1.5,
          fontStyle: "italic",
          color: "text.secondary",
          fontSize: { xs: "0.875rem", sm: "0.875rem" },
        }}
      >
        Cung Chúc Tân Xuân
      </Typography>
      {/* dynamic content ends here */}

      <div className="mt-6 sm:mt-8 inline-flex items-center gap-2 sm:gap-3 rounded-full px-3 sm:px-4 py-2 text-xs sm:text-sm text-[#990011] shadow">
        <Switch
          checked={allowConnect}
          onChange={handleSwitchChange}
          color="warning"
          size="small"
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: "#eab308", // yellow-500
              "&:hover": {
                backgroundColor: "rgba(234, 179, 8, 0.08)",
              },
            },
            "& .MuiSwitch-track": {
              backgroundColor: "#d1d5db", // gray-300
            },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: "#eab308",
            },
          }}
        />
        {welcome.allowConnect}
      </div>

      <InDevelopmentModal
        open={isDevModalOpen}
        onCancel={() => setIsDevModalOpen(false)}
      />
    </div>
  )
}

export default WelcomeSection
