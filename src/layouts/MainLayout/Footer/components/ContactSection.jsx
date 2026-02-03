import { Send } from "@mui/icons-material"
import { useLanguage } from "@context/LanguageContext.jsx"
import { Typography, TextField } from "@mui/material"

const ContactSection = () => {
  const { t } = useLanguage()
  const footerText = t.footer

  return (
    <div className="flex-1 w-full flex flex-col items-center lg:items-end">
      <Typography
        variant="subtitle1"
        className="font-bold uppercase text-center tracking-wide w-full max-w-md"
        sx={{ marginBottom: 2 }}
      >
        {footerText.contactUs}
      </Typography>

      <div className="w-full max-w-md">
        <form className="flex flex-col gap-5">
          <TextField
            placeholder={footerText.contactPlaceholder}
            variant="outlined"
            fullWidth
            inputProps={{
              style: {
                fontSize: "16px", // Prevents iOS zoom on focus
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "9999px",
                backgroundColor: "white",
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.6)",
                },
                "&:hover fieldset": {
                  borderColor: "#fcd34d",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#fcd34d",
                },
              },
              "& .MuiOutlinedInput-input": {
                padding: { xs: "12px 20px", sm: "10px 20px" },
                fontSize: "16px",
              },
            }}
          />
          <TextField
            type="email"
            placeholder={footerText.emailPlaceholder}
            variant="outlined"
            fullWidth
            inputProps={{
              style: {
                fontSize: "16px", // Prevents iOS zoom on focus
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "9999px",
                backgroundColor: "white",
                "& fieldset": {
                  borderColor: "rgba(255, 255, 255, 0.6)",
                },
                "&:hover fieldset": {
                  borderColor: "#fcd34d",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#fcd34d",
                },
              },
              "& .MuiOutlinedInput-input": {
                padding: { xs: "12px 20px", sm: "10px 20px" },
                fontSize: "16px",
              },
            }}
          />
        </form>

        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/90">
          <div className="flex-1 text-center sm:text-left sm:pr-4 italic text-white/90">
            <Typography
              variant="body2"
              component="span"
              className="font-bold text-base"
            >
              Cat Speak{" "}
            </Typography>

            <Typography variant="body2" component="span" className="text-sm">
              {footerText.contactMessage}
            </Typography>
          </div>

          <button
            type="button"
            className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-yellow-300 text-[#bc1e46] shadow-lg transition hover:scale-105"
            aria-label={footerText.sendContact}
          >
            <Send sx={{ fontSize: 20 }} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ContactSection
