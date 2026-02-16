import { useState } from "react"
import { Box, IconButton, InputAdornment } from "@mui/material"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import FormTextField from "../../forms/FormTextField"
import FormSelectField from "../../forms/FormSelectField"
import FormDatePicker from "../../forms/FormDatePicker"
import AgreementCheckbox from "../../forms/AgreementCheckbox"
import PolicyModal from "../PolicyModal"

const RegisterFormFields = ({
  authText,
  formData,
  setFormData,
  errors,
  setErrors,
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [policyModal, setPolicyModal] = useState({ open: false, title: "" })

  const handleOpenPolicy = (title) => (e) => {
    e.preventDefault()
    setPolicyModal({ open: true, title })
  }

  const handleClosePolicy = () => {
    setPolicyModal({ open: false, title: "" })
  }

  const languageOptions = [
    { value: "english", label: "English" },
    { value: "vietnamese", label: "Tiếng Việt" },
    { value: "chinese", label: "中文" },
  ]

  const countryOptions = [
    { value: "vietnam", label: "Vietnam" },
    { value: "usa", label: "United States" },
    { value: "china", label: "China" },
  ]

  const handleChange = (field) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value
    setFormData({ ...formData, [field]: value })
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" })
    }
  }

  return (
    <>
      {/* Form Fields Group */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {/* Username */}
        <FormTextField
          label={authText.fullNameLabel}
          placeholder={authText.fullNamePlaceholder}
          value={formData.username}
          onChange={handleChange("username")}
          error={!!errors.username}
          helperText={errors.username}
        />

        {/* Email */}
        <FormTextField
          label={authText.emailLabel}
          placeholder={authText.emailPlaceholder}
          value={formData.email}
          onChange={handleChange("email")}
          error={!!errors.email}
          helperText={errors.email}
          type="email"
        />

        {/* Date of Birth and Language - Side by Side */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          {/* Date of Birth */}
          <Box sx={{ flex: 1 }}>
            <FormDatePicker
              label={authText.dateOfBirthLabel}
              placeholder={authText.dateOfBirthPlaceholder}
              value={formData.dateOfBirth}
              onChange={handleChange("dateOfBirth")}
              error={!!errors.dateOfBirth}
              helperText={errors.dateOfBirth}
            />
          </Box>

          {/* Preferred Language */}
          <FormSelectField
            label={authText.languageLabel}
            placeholder={authText.languagePlaceholder}
            value={formData.preferredLanguage}
            onChange={handleChange("preferredLanguage")}
            error={!!errors.preferredLanguage}
            errorText={errors.preferredLanguage}
            options={languageOptions}
          />
        </Box>

        {/* Password and Country - Side by Side */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
          }}
        >
          {/* Password */}
          <Box sx={{ flex: 1 }}>
            <FormTextField
              label={authText.passwordLabel}
              placeholder={authText.passwordPlaceholder}
              value={formData.password}
              onChange={handleChange("password")}
              error={!!errors.password}
              helperText={errors.password}
              type={showPassword ? "text" : "password"}
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

          {/* Country */}
          <FormSelectField
            label={authText.countryLabel}
            placeholder={authText.countryPlaceholder}
            value={formData.country}
            onChange={handleChange("country")}
            error={!!errors.country}
            errorText={errors.country}
            options={countryOptions}
          />
        </Box>
      </Box>

      {/* Checkboxes Group */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        {/* First Agreement Checkbox - Terms and Privacy */}
        <AgreementCheckbox
          checked={formData.termsAgreement}
          onChange={handleChange("termsAgreement")}
        >
          {authText.agreePrefix}{" "}
          <button
            type="button"
            className="font-semibold text-[#8f0d15] hover:underline"
            onClick={handleOpenPolicy(authText.serviceTerms)}
          >
            {authText.serviceTerms}
          </button>{" "}
          {authText.and}{" "}
          <button
            type="button"
            className="font-semibold text-[#8f0d15] hover:underline"
            onClick={handleOpenPolicy(authText.privacyPolicy)}
          >
            {authText.privacyPolicy}
          </button>{" "}
          {authText.companySuffix}
        </AgreementCheckbox>

        {/* Second Agreement Checkbox - Payment and IP */}
        <AgreementCheckbox
          checked={formData.policyAgreement}
          onChange={handleChange("policyAgreement")}
        >
          {authText.agreePrefix}{" "}
          <button
            type="button"
            className="font-semibold text-[#8f0d15] hover:underline"
            onClick={handleOpenPolicy(authText.paymentPolicy)}
          >
            {authText.paymentPolicy}
          </button>{" "}
          {authText.and}{" "}
          <button
            type="button"
            className="font-semibold text-[#8f0d15] hover:underline"
            onClick={handleOpenPolicy(authText.ipPolicy)}
          >
            {authText.ipPolicy}
          </button>{" "}
          {authText.companySuffix}
        </AgreementCheckbox>
      </Box>

      {/* Policy Modal */}
      <PolicyModal
        open={policyModal.open}
        onClose={handleClosePolicy}
        title={policyModal.title}
      />
    </>
  )
}

export default RegisterFormFields
