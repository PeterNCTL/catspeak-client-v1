import React from "react"
import { LockOutlined } from "@ant-design/icons"
import { useLanguage } from "@/shared/context/LanguageContext.jsx"
import { Form, Input, Button, message } from "antd"
import { useResetPasswordMutation } from "../../../api/authApi"

const ResetPasswordFormStep = ({ email, token, onSuccess }) => {
  const { t } = useLanguage()
  const authText = t.auth || {}
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation()
  const [form] = Form.useForm()

  const handleResetPassword = async (values) => {
    try {
      await resetPassword({
        email,
        token: token, // This is now the valid OTP
        newPassword: values.newPassword,
      }).unwrap()

      message.success("Password has been reset successfully!")
      onSuccess()
    } catch (err) {
      console.error("Reset password failed:", err)
      message.error(err?.data?.message || "Failed to reset password.")
    }
  }

  return (
    <div className="animate-fadeIn">
      <h2 className="text-center text-3xl font-black text-[#8f0d15]">
        Reset Password
      </h2>
      <p className="mt-3 text-center text-sm text-gray-600">
        Create a new password for your account.
      </p>

      <Form
        form={form}
        name="reset-password-final"
        layout="vertical"
        onFinish={handleResetPassword}
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
            { required: true, message: "Please input your new password!" },
            { min: 6, message: "Password must be at least 6 characters!" },
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
            { required: true, message: "Please confirm your password!" },
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
            loading={isResetting}
            className="h-12 text-base font-bold uppercase tracking-wider rounded-full shadow-lg border-none bg-gradient-to-r from-[#f08d1d] to-[#f4ab1b] hover:shadow-xl"
          >
            {authText.resetPasswordButton || "Reset Password"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default ResetPasswordFormStep
