import { useState } from "react"
import { FiX } from "react-icons/fi"
import { useLanguage } from "@context/LanguageContext.jsx"
import AuthButton from "./AuthButton"
import { useRegisterMutation } from "@/store/api/authApi"
import { useNavigate } from "react-router-dom"
import AuthPopupAnim from "./AuthPopupAnim"
import { Form, Alert, message } from "antd"
import RegisterFormFields from "./RegisterFormFields"

const RegisterPopup = ({ onClose, onSwitchMode }) => {
  const { t } = useLanguage()
  const authText = t.auth
  const navigate = useNavigate()
  const [register, { isLoading }] = useRegisterMutation()
  const [form] = Form.useForm()
  const [apiError, setApiError] = useState(null)

  const onFinish = async (values) => {
    setApiError(null)
    try {
      await register(values).unwrap()
      message.success("Registration successful! Please check your email.")
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
    <AuthPopupAnim className="relative max-w-6xl w-full rounded-[32px] bg-white px-8 pb-10 pt-12 text-gray-800 shadow-[0_25px_60px_rgba(0,0,0,0.12)]">
      <button
        type="button"
        aria-label="Close"
        className="absolute right-6 top-6 text-2xl text-gray-500 transition hover:text-gray-700"
        onClick={onClose}
      >
        <FiX />
      </button>

      <h2 className="text-center text-3xl font-black text-[#8f0d15]">
        {authText.registerTitle}
      </h2>

      <Form
        form={form}
        name="register_form"
        layout="vertical"
        onFinish={onFinish}
        className="mt-8 flex flex-col gap-2"
        requiredMark={false}
      >
        <RegisterFormFields authText={authText} />

        {apiError && (
          <Alert message={apiError} type="error" showIcon className="mb-2" />
        )}

        <AuthButton type="submit" className="mt-2" disabled={isLoading}>
          {isLoading
            ? "ĐANG ĐĂNG KÝ..."
            : authText.registerButton.toUpperCase()}
        </AuthButton>
      </Form>

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
    </AuthPopupAnim>
  )
}

export default RegisterPopup
