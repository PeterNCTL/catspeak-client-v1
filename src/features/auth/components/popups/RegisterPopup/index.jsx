import { useState } from "react"
import { FiX } from "react-icons/fi"
import {
  Box,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  useTheme,
  useMediaQuery,
  Alert,
} from "@mui/material"
import { useLanguage } from "@/shared/context/LanguageContext.jsx"
import AuthButton from "../../ui/AuthButton"
import { useRegisterMutation } from "@/store/api/authApi"
import { useNavigate } from "react-router-dom"
import RegisterFormFields from "./RegisterFormFields"
import { colors } from "@/shared/utils/colors"

const RegisterPopup = ({ open, onClose, onSwitchMode }) => {
  const { t } = useLanguage()
  const authText = t.auth
  const navigate = useNavigate()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"))

  const [register, { isLoading }] = useRegisterMutation()
  const [apiError, setApiError] = useState(null)

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    dateOfBirth: "",
    preferredLanguage: "",
    password: "",
    country: "",
    termsAgreement: false,
    policyAgreement: false,
  })

  const [errors, setErrors] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    setApiError(null)

    try {
      await register(formData).unwrap()
      // Show success message (you might want to use a snackbar here)
      console.log("Registration successful! Please check your email.")
      onClose()
      navigate("/")
    } catch (err) {
      console.error("Registration failed:", err)
      setApiError(
        err?.data?.message || "Registration failed. Please try again.",
      )
    }
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
      maxWidth="md"
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
          {authText.registerTitle}
        </DialogTitle>

        <DialogContent sx={{ pb: 1 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <RegisterFormFields
                authText={authText}
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                setErrors={setErrors}
              />

              {apiError && (
                <Alert severity="error" sx={{ borderRadius: "12px" }}>
                  {apiError}
                </Alert>
              )}

              <AuthButton type="submit" className="mt-2" disabled={isLoading}>
                {isLoading
                  ? "ĐANG ĐĂNG KÝ..."
                  : authText.registerButton.toUpperCase()}
              </AuthButton>
            </Stack>
          </Box>

          <div className="mt-6 text-center text-sm text-gray-600">
            <div className="relative mb-4">
              <span className="relative z-10 bg-white px-4 font-semibold text-gray-500">
                {authText.or}
              </span>
              <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-gray-200" />
            </div>
            {authText.haveAccount}{" "}
            <button
              type="button"
              className="font-semibold text-[#8f0d15] hover:underline"
              onClick={() => onSwitchMode("login")}
            >
              {authText.loginLink}
            </button>
          </div>
        </DialogContent>
      </Box>
    </Dialog>
  )
}

export default RegisterPopup
