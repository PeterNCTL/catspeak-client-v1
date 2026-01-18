import React, { useState } from "react"
import { FiX } from "react-icons/fi"
import { LockOutlined, CheckCircleOutlined } from "@ant-design/icons"
import { useLanguage } from "@context/LanguageContext.jsx"
import { Form, Input, Button, message } from "antd"
import { useResetPasswordMutation } from "@/store/api/authApi"
import { useSearchParams } from "react-router-dom"
import AuthPopupAnim from "./AuthPopupAnim"

const ResetPasswordPopup = ({ onClose, onSwitchMode }) => {
  const { t } = useLanguage()
  const authText = t.auth || {} // Fallback if text not loaded
  const [form] = Form.useForm()

  // Get token and email from URL since this popup is triggered by the link
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const email = searchParams.get("email")

  const [resetPassword, { isLoading }] = useResetPasswordMutation()
  const [isSuccess, setIsSuccess] = useState(false)

  const handleFinish = async (values) => {
    if (!token || !email) {
      message.error("Invalid reset link. Missing token or email.")
      return
    }

    try {
      await resetPassword({
        email,
        token,
        password: values.newPassword,
        confirmPassword: values.confirmPassword,
      }).unwrap()

      setIsSuccess(true)
      message.success("Password has been reset successfully!")

      // Auto switch to login after delay
      setTimeout(() => {
        onSwitchMode("login")
      }, 2000)
    } catch (err) {
      console.error("Reset password failed:", err)
      message.error(err?.data?.message || "Failed to reset password.")
    }
  }

  // Success View
  if (isSuccess) {
    return (
      <AuthPopupAnim className="relative rounded-[32px] bg-white px-8 pb-10 pt-12 text-gray-800 shadow-[0_25px_60px_rgba(0,0,0,0.12)] max-w-xl w-full text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
          <CheckCircleOutlined className="text-4xl text-green-500" />
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Password Changed!
        </h2>
        <p className="mb-8 text-gray-600">
          Your password has been successfully updated.
        </p>
        <Button
          type="primary"
          block
          onClick={() => onSwitchMode("login")}
          className="h-12 rounded-full text-base font-bold uppercase tracking-wider shadow-lg"
        >
          Login Now
        </Button>
      </AuthPopupAnim>
    )
  }

  // Form View
  return (
    <AuthPopupAnim className="relative rounded-[32px] bg-white px-8 pb-10 pt-12 text-gray-800 shadow-[0_25px_60px_rgba(0,0,0,0.12)] max-w-xl w-full">
      <button
        type="button"
        aria-label="Close"
        className="absolute right-6 top-6 text-2xl text-gray-500 transition hover:text-gray-700"
        onClick={onClose}
      >
        <FiX />
      </button>

      <div className="animate-fadeIn">
        <h2 className="text-center text-3xl font-black text-[#8f0d15]">
          Reset Password
        </h2>
        <p className="mt-3 text-center text-sm text-gray-600">
          Enter your new password below.
        </p>

        <Form
          form={form}
          name="reset-password-popup"
          layout="vertical"
          onFinish={handleFinish}
          className="mt-6"
        >
          <Form.Item
            name="newPassword"
            label={
              <span className="text-sm font-semibold text-gray-700">
                {authText.newPasswordLabel || "New Password"}
              </span>
            }
            rules={[
              {
                required: true,
                message: "Please input your new password!",
              },
              {
                min: 6,
                message: "Password must be at least 6 characters!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder={
                authText.newPasswordPlaceholder || "Enter new password"
              }
              className="rounded-full px-4 py-3"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label={
              <span className="text-sm font-semibold text-gray-700">
                {authText.confirmPasswordLabel || "Confirm Password"}
              </span>
            }
            dependencies={["newPassword"]}
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match!"),
                  )
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder={
                authText.confirmPasswordPlaceholder || "Confirm new password"
              }
              className="rounded-full px-4 py-3"
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isLoading}
              className="h-12 text-base font-bold uppercase tracking-wider rounded-full shadow-lg border-none bg-gradient-to-r from-[#f08d1d] to-[#f4ab1b] hover:shadow-xl"
            >
              {authText.resetPasswordButton || "Reset Password"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </AuthPopupAnim>
  )
}

export default ResetPasswordPopup
