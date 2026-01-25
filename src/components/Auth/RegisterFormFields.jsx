import FormInput from "./FormInput"
import FormSelect from "./FormSelect"
import AgreementCheckbox from "./AgreementCheckbox"

const RegisterFormFields = ({ authText }) => {
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

  return (
    <>
      {/* Username */}
      <FormInput
        name="username"
        label={authText.fullNameLabel}
        placeholder={authText.fullNamePlaceholder}
        rules={[{ required: true, message: "Please input your username!" }]}
      />

      {/* Email */}
      <FormInput
        name="email"
        label={authText.emailLabel}
        placeholder={authText.emailPlaceholder}
        rules={[
          { required: true, message: "Please input your email!" },
          { type: "email", message: "Please enter a valid email!" },
        ]}
      />

      {/* Date of Birth and Preferred Language - Side by Side */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormInput
          name="dateOfBirth"
          label="Ngày sinh"
          placeholder="YYYY-MM-DD"
          rules={[
            { required: true, message: "Please input your date of birth!" },
          ]}
        />

        <FormSelect
          name="preferredLanguage"
          label={authText.languageLabel}
          placeholder="Chọn ngôn ngữ bạn muốn học"
          rules={[{ required: true, message: "Please select a language!" }]}
          options={languageOptions}
        />
      </div>

      {/* Password and Country - Side by Side */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormInput
          name="password"
          label={authText.passwordLabel}
          placeholder={authText.passwordPlaceholder}
          type="password"
          rules={[
            { required: true, message: "Please input your password!" },
            { min: 6, message: "Password must be at least 6 characters" },
          ]}
        />

        <FormSelect
          name="country"
          label={authText.countryLabel}
          placeholder="Chọn quốc gia bạn đang sinh sống"
          rules={[{ required: true, message: "Please select your country!" }]}
          options={countryOptions}
        />
      </div>

      <div>
        {/* First Agreement Checkbox - Terms and Privacy */}
        <AgreementCheckbox
          name="termsAgreement"
          style={{ marginBottom: 8 }}
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(
                    new Error(
                      "You must agree to the terms and privacy policy",
                    ),
                  ),
            },
          ]}
        >
          {authText.agreePrefix}{" "}
          <button
            type="button"
            className="font-semibold text-[#8f0d15] hover:underline"
          >
            {authText.serviceTerms}
          </button>{" "}
          {authText.and}{" "}
          <button
            type="button"
            className="font-semibold text-[#8f0d15] hover:underline"
          >
            {authText.privacyPolicy}
          </button>{" "}
          {authText.companySuffix}
        </AgreementCheckbox>

        {/* Second Agreement Checkbox - Payment and IP */}
        <AgreementCheckbox
          name="policyAgreement"
          style={{ marginBottom: 12 }}
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(
                    new Error("You must agree to the payment and IP policy"),
                  ),
            },
          ]}
        >
          {authText.agreePrefix}{" "}
          <button
            type="button"
            className="font-semibold text-[#8f0d15] hover:underline"
          >
            {authText.paymentPolicy}
          </button>{" "}
          {authText.and}{" "}
          <button
            type="button"
            className="font-semibold text-[#8f0d15] hover:underline"
          >
            {authText.ipPolicy}
          </button>{" "}
          {authText.companySuffix}
        </AgreementCheckbox>
      </div>
    </>
  )
}

export default RegisterFormFields
