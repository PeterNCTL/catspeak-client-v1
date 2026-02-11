import React, { useState } from "react"
import { FiX } from "react-icons/fi"
import { MailOutlined } from "@ant-design/icons"
import { useLanguage } from "@/shared/context/LanguageContext.jsx"
import { Form, Input, Button, message } from "antd"
import { useForgotPasswordMutation } from "../../../api/authApi"
import AuthPopupAnim from "../../ui/AuthPopupAnim"

const ForgotPasswordPopup = ({ onClose, onSwitchMode }) => {
  const { t } = useLanguage()
  const authText = t.auth

  const [email, setEmail] = useState("")
  const [form] = Form.useForm()

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation()
  const [isSuccess, setIsSuccess] = useState(false)

  // Request Password Reset Link
  const handleRequestLink = async (values) => {
    try {
      setEmail(values.email)
      await forgotPassword({ email: values.email }).unwrap()

      message.success("Password reset link has been sent to your email!")
      setIsSuccess(true)
      form.resetFields()
    } catch (err) {
      console.error("Request reset link failed:", err)
      message.error(
        err?.data?.message || "Failed to send reset link. Please try again.",
      )
    }
  }

  // Render Content
  const renderContent = () => {
    if (isSuccess) {
      return (
        <div className="animate-fadeIn text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
            <MailOutlined className="text-3xl text-green-500" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Check your email
          </h2>
          <p className="mb-8 text-gray-600">
            We've sent a password reset link to <strong>{email}</strong>.
            <br />
            Please check your inbox and follow the instructions.
          </p>
          <Button
            type="primary"
            block
            onClick={() => onSwitchMode("login")}
            className="h-12 rounded-full text-base font-bold uppercase tracking-wider shadow-lg"
          >
            Back to Login
          </Button>
          <p className="mt-4 text-sm text-gray-500">
            Did not receive the email? Check your spam folder or{" "}
            <button
              onClick={() => setIsSuccess(false)}
              className="font-semibold text-[#f08d1d] hover:text-[#d87c15]"
            >
              try again
            </button>
          </p>
        </div>
      )
    }

    return (
      <div className="animate-fadeIn">
        <h2 className="text-center text-3xl font-black text-[#8f0d15]">
          {authText.forgotStep1Title}
        </h2>
        <p className="mt-3 text-center text-sm text-gray-600">
          {authText.forgotStep1Subtitle}
        </p>

        <Form
          form={form}
          name="request-link"
          layout="vertical"
          onFinish={handleRequestLink}
          className="mt-6"
        >
          <Form.Item
            name="email"
            label={
              <span className="text-sm font-semibold text-gray-700">
                {authText.emailLabel}
              </span>
            }
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
              {
                type: "email",
                message: "Please enter a valid email!",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder={authText.emailPlaceholder}
              className="rounded-full px-4 py-3"
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isLoading}
              className="h-12 rounded-full border-none bg-gradient-to-r from-[#f08d1d] to-[#f4ab1b] text-base font-bold uppercase tracking-wider shadow-lg hover:shadow-xl"
            >
              {authText.sendOtpButton || "Send Reset Link"}
            </Button>
          </Form.Item>
        </Form>

        <p className="mt-6 text-center text-sm text-gray-700">
          {authText.backToLogin}{" "}
          <button
            type="button"
            className="font-semibold text-[#f08d1d] hover:text-[#d87c15]"
            onClick={() => onSwitchMode("login")}
          >
            {authText.loginLink}
          </button>
        </p>
      </div>
    )
  }

  return (
    <AuthPopupAnim className="relative rounded-[32px] bg-white px-8 pb-10 pt-12 text-gray-800 shadow-[0_25px_60px_rgba(0,0,0,0.12)] max-w-2xl w-full">
      <button
        type="button"
        aria-label="Close"
        className="absolute right-6 top-6 text-2xl text-gray-500 transition hover:text-gray-700"
        onClick={onClose}
      >
        <FiX />
      </button>

      {renderContent()}
    </AuthPopupAnim>
  )
}

export default ForgotPasswordPopup
