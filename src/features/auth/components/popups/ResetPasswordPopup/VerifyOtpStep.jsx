import React from "react"
import { FiArrowLeft } from "react-icons/fi"
import { NumberOutlined } from "@ant-design/icons"
import { Form, Input, Button, message } from "antd"
import { useVerifyResetOtpMutation } from "../../../api/authApi"

const VerifyOtpStep = ({ email, onSuccess, onBack }) => {
  const [verifyResetOtp, { isLoading: isVerifyingOtp }] =
    useVerifyResetOtpMutation()

  const handleVerifyOtp = async (values) => {
    try {
      const otpValue = values.otp.trim()

      await verifyResetOtp({
        email,
        otp: otpValue,
      }).unwrap()

      // The OTP itself is the token for the reset password step
      message.success("OTP verified!")
      onSuccess(otpValue)
    } catch (err) {
      console.error("OTP verification failed:", err)
      message.error(err?.data?.message || "Invalid or expired OTP.")
    }
  }

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-start mb-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center text-gray-500 hover:text-gray-800 transition-colors text-sm font-semibold"
        >
          <FiArrowLeft className="mr-1" />
          Back
        </button>
      </div>

      <h2 className="text-center text-3xl font-black text-[#8f0d15]">
        Verify OTP
      </h2>
      <p className="mt-3 text-center text-sm text-gray-600">
        Enter the 6-digit code sent to <strong>{email}</strong>
      </p>

      <Form
        name="verify-otp"
        layout="vertical"
        onFinish={handleVerifyOtp}
        className="mt-6"
      >
        <Form.Item
          name="otp"
          rules={[
            { required: true, message: "Please enter the OTP!" },
            { len: 6, message: "OTP must be 6 digits" },
          ]}
        >
          <Input
            prefix={<NumberOutlined className="text-gray-400" />}
            placeholder="Enter 6-digit OTP"
            className="rounded-full px-4 py-3 text-center text-lg tracking-widest"
            maxLength={6}
          />
        </Form.Item>

        <Form.Item className="mb-0">
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isVerifyingOtp}
            className="h-12 text-base font-bold uppercase tracking-wider rounded-full shadow-lg border-none bg-gradient-to-r from-[#f08d1d] to-[#f4ab1b] hover:shadow-xl"
          >
            Verify Code
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default VerifyOtpStep
