import React from "react"
import { MailOutlined } from "@ant-design/icons"
import { Form, Input, Button, message } from "antd"
import { useForgotPasswordMutation } from "@/store/api/authApi"

const RequestOtpStep = ({ onSuccess }) => {
  const [forgotPassword, { isLoading: isSendingOtp }] =
    useForgotPasswordMutation()

  const handleRequestOtp = async (values) => {
    try {
      const emailValue = values.email.trim()
      await forgotPassword({ email: emailValue }).unwrap()
      message.success("OTP sent to your email!")
      onSuccess(emailValue)
    } catch (err) {
      console.error("Failed to send OTP:", err)
      message.error(err?.data?.message || "Failed to send OTP.")
    }
  }

  return (
    <div className="animate-fadeIn">
      <h2 className="text-center text-3xl font-black text-[#8f0d15]">
        Forgot Password?
      </h2>
      <p className="mt-3 text-center text-sm text-gray-600">
        Enter your email address to receive a verification code.
      </p>

      <Form
        name="request-otp"
        layout="vertical"
        onFinish={handleRequestOtp}
        className="mt-6"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input
            prefix={<MailOutlined className="text-gray-400" />}
            placeholder="Enter your email"
            className="rounded-full px-4 py-3"
          />
        </Form.Item>

        <Form.Item className="mb-0">
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isSendingOtp}
            className="h-12 text-base font-bold uppercase tracking-wider rounded-full shadow-lg border-none bg-gradient-to-r from-[#f08d1d] to-[#f4ab1b] hover:shadow-xl"
          >
            Send OTP
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default RequestOtpStep
