import { useState } from "react"
import { Box, Typography, Stack, TextField, Alert } from "@mui/material"
import AuthButton from "../../ui/AuthButton"
import { useForgotPasswordMutation } from "../../../api/authApi"
import { colors } from "@/shared/utils/colors"

const RequestOtpStep = ({ onSuccess }) => {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")

  const [forgotPassword, { isLoading: isSendingOtp }] =
    useForgotPasswordMutation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!email) {
      setError("Please input your email!")
      return
    }

    try {
      const emailValue = email.trim()
      await forgotPassword({ email: emailValue }).unwrap()
      // Message handled by parent or just proceed
      onSuccess(emailValue)
    } catch (err) {
      console.error("Failed to send OTP:", err)
      setError(err?.data?.message || "Failed to send OTP.")
    }
  }

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
    <div>
      <Typography
        variant="h4"
        align="center"
        sx={{
          fontWeight: 900,
          color: "#8f0d15",
          mb: 1,
          fontFamily: "'Inter', sans-serif",
          fontSize: "1.875rem",
        }}
      >
        Forgot Password?
      </Typography>
      <Typography
        variant="body2"
        align="center"
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        Enter your email address to receive a verification code.
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Box>
            <Typography
              display="block"
              gutterBottom
              sx={{ fontWeight: 700, fontSize: "0.875rem" }}
            >
              Email
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError("")
              }}
              error={!!error}
              sx={inputColorSx}
            />
          </Box>

          {error && (
            <Alert severity="error" sx={{ borderRadius: "12px" }}>
              {error}
            </Alert>
          )}

          <AuthButton type="submit" disabled={isSendingOtp}>
            {isSendingOtp ? "SENDING..." : "SEND OTP"}
          </AuthButton>
        </Stack>
      </Box>
    </div>
  )
}

export default RequestOtpStep
