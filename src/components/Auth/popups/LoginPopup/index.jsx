import { useState } from "react"
import { FiX } from "react-icons/fi"
import { useLanguage } from "@context/LanguageContext.jsx"
import AuthButton from "../../ui/AuthButton"
import { Form, Checkbox, message, Alert } from "antd"

import { useLoginMutation } from "@/store/api/authApi"
import AuthPopupAnim from "../../ui/AuthPopupAnim"

import FormInput from "../../ui/FormInput"

const LoginPopup = ({ onClose, onSwitchMode }) => {
  const { t } = useLanguage()
  const authText = t.auth
  const [form] = Form.useForm()
  const [apiError, setApiError] = useState(null)

  const [login, { isLoading }] = useLoginMutation()

  const onFinish = async (values) => {
    setApiError(null)
    try {
      console.log("Calling login API...", values)
      const result = await login({
        email: values.email,
        password: values.password,
      }).unwrap()
      console.log("Login successful:", result)
      message.success("Login successful!")
      onClose()
    } catch (err) {
      console.error("Login failed:", err)
      setApiError(
        err?.data?.message || err.message || "Login failed. Please try again.",
      )
    }
  }

  return (
    <AuthPopupAnim className="relative rounded-[32px] bg-white px-8 pb-10 pt-12 text-gray-800 shadow-[0_25px_60px_rgba(0,0,0,0.12)]">
      <button
        type="button"
        aria-label="Close"
        className="absolute right-6 top-6 text-2xl text-gray-500 transition hover:text-gray-700"
        onClick={onClose}
      >
        <FiX />
      </button>

      <h2 className="text-center text-3xl font-black text-[#8f0d15]">
        {authText.loginTitle}
      </h2>

      <Form
        form={form}
        name="login_form"
        layout="vertical"
        onFinish={onFinish}
        className="mt-8 flex flex-col gap-2"
        requiredMark={false}
      >
        <FormInput
          name="email"
          label={authText.emailLabel}
          placeholder={authText.emailPlaceholder}
          rules={[
            { required: true, message: authText.validationEmailRequired },
            { type: "email", message: authText.validationEmailInvalid },
          ]}
        />

        <FormInput
          name="password"
          label={authText.passwordLabel}
          placeholder={authText.passwordPlaceholder}
          type="password"
          rules={[
            { required: true, message: authText.validationPasswordRequired },
          ]}
        />

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600 mb-2">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox className="accent-[#f08d1d]">
              {authText.rememberMe}
            </Checkbox>
          </Form.Item>
          <button
            type="button"
            className="font-semibold text-[#8f0d15] hover:underline"
            onClick={() => onSwitchMode("forgot")}
          >
            {authText.forgotLink}
          </button>
        </div>

        {apiError && (
          <Alert message={apiError} type="error" showIcon className="mb-2" />
        )}

        <AuthButton type="submit" className="mt-2" disabled={isLoading}>
          {isLoading ? "..." : authText.loginButton.toUpperCase()}
        </AuthButton>
      </Form>

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
    </AuthPopupAnim>
  )
}

export default LoginPopup
