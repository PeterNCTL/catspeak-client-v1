import { useState } from "react"
import { FiX } from "react-icons/fi"
import {
  Box,
  Stack,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  useTheme,
  useMediaQuery,
  IconButton,
  InputAdornment,
} from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { useLanguage } from "@/shared/context/LanguageContext.jsx"
import AuthButton from "../../ui/AuthButton"
import { useLoginMutation } from "../../../api/authApi"
import { colors } from "@/shared/utils/colors"

const LoginPopup = ({ open, onClose, onSwitchMode }) => {
  const { t } = useLanguage()
  const authText = t.auth
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"))

  const [apiError, setApiError] = useState(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [login, { isLoading }] = useLoginMutation()

  const validateEmail = (value) => {
    if (!value) {
      return authText.validationEmailRequired
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return authText.validationEmailInvalid
    }
    return ""
  }

  const validatePassword = (value) => {
    if (!value) {
      return authText.validationPasswordRequired
    }
    return ""
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError(null)

    // Validate fields
    const emailErr = validateEmail(email)
    const passwordErr = validatePassword(password)

    setEmailError(emailErr)
    setPasswordError(passwordErr)

    if (emailErr || passwordErr) {
      return
    }

    try {
      console.log("Calling login API...", { email, password })
      const result = await login({
        email,
        password,
      }).unwrap()
      console.log("Login successful:", result)
      onClose()
    } catch (err) {
      console.error("Login failed:", err)
      setApiError(
        err?.data?.message || err.message || "Login failed. Please try again.",
      )
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
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick" && onClose) {
          onClose()
        }
      }}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "24px",
          padding: 2,
        },
      }}
    >
      <Box component="div">
        <button
          type="button"
          aria-label="Close"
          className="absolute right-6 top-6 text-2xl text-gray-500 transition hover:text-gray-700"
          onClick={onClose}
        >
          <FiX />
        </button>

        <DialogTitle
          sx={{
            textAlign: "center",
            color: "#8f0d15",
            fontSize: "1.875rem",
            fontWeight: 900,
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {authText.loginTitle}
        </DialogTitle>

        <DialogContent sx={{ pb: 1 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Stack spacing={4}>
                {/* Email Input */}
                <Box>
                  <Typography
                    display="block"
                    gutterBottom
                    sx={{ fontWeight: 700, fontSize: "0.875rem" }}
                  >
                    {authText.emailLabel}
                  </Typography>
                  <TextField
                    fullWidth
                    type="email"
                    placeholder={authText.emailPlaceholder}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setEmailError("")
                    }}
                    error={!!emailError}
                    helperText={emailError}
                    sx={inputColorSx}
                  />
                </Box>

                {/* Password Input */}
                <Box>
                  <Typography
                    display="block"
                    gutterBottom
                    sx={{ fontWeight: 700, fontSize: "0.875rem" }}
                  >
                    {authText.passwordLabel}
                  </Typography>
                  <TextField
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    placeholder={authText.passwordPlaceholder}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setPasswordError("")
                    }}
                    error={!!passwordError}
                    helperText={passwordError}
                    sx={inputColorSx}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            onMouseDown={(e) => e.preventDefault()}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Stack>

              {/* Remember Me & Forgot Password */}
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      sx={{
                        color: colors.red[700],
                        "&.Mui-checked": {
                          color: colors.red[700],
                        },
                      }}
                    />
                  }
                  label={authText.rememberMe}
                />
                <button
                  type="button"
                  className="font-semibold text-[#8f0d15] hover:underline"
                  onClick={() => onSwitchMode("forgot")}
                >
                  {authText.forgotLink}
                </button>
              </div>

              {/* Error Alert */}
              {apiError && (
                <Alert severity="error" sx={{ borderRadius: "12px" }}>
                  {apiError}
                </Alert>
              )}

              {/* Submit Button */}
              <AuthButton type="submit" className="mt-2" disabled={isLoading}>
                {isLoading ? "..." : authText.loginButton.toUpperCase()}
              </AuthButton>
            </Stack>
          </Box>

          <p className="mt-7 text-center text-sm text-gray-700">
            {authText.dontHaveAccount}{" "}
            <button
              type="button"
              className="font-semibold text-[#8f0d15] hover:underline"
              onClick={() => onSwitchMode("register")}
            >
              {authText.registerLink}
            </button>
          </p>
        </DialogContent>
      </Box>
    </Dialog>
  )
}

export default LoginPopup
