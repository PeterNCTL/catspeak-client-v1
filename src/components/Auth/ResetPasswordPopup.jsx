import React, { useState } from "react"
import { FiX } from "react-icons/fi"
import { CheckCircleOutlined } from "@ant-design/icons"
import { Button } from "antd"
import AuthPopupAnim from "./AuthPopupAnim"
import RequestOtpStep from "./ResetPasswordSteps/RequestOtpStep"
import VerifyOtpStep from "./ResetPasswordSteps/VerifyOtpStep"
import ResetPasswordFormStep from "./ResetPasswordSteps/ResetPasswordFormStep"

const STEPS = {
  REQUEST_OTP: 0,
  VERIFY_OTP: 1,
  RESET_PASSWORD: 2,
  SUCCESS: 3,
}

const ResetPasswordPopup = ({ onClose, onSwitchMode }) => {
  const [currentStep, setCurrentStep] = useState(STEPS.REQUEST_OTP)
  const [email, setEmail] = useState("")
  const [token, setToken] = useState("")

  // --- Handlers ---

  const handleEmailSubmitted = (submittedEmail) => {
    setEmail(submittedEmail)
    setCurrentStep(STEPS.VERIFY_OTP)
  }

  const handleOtpVerified = (otpToken) => {
    setToken(otpToken)
    setCurrentStep(STEPS.RESET_PASSWORD)
  }

  const handlePasswordResetSuccess = () => {
    setCurrentStep(STEPS.SUCCESS)
    // Auto switch to login after delay
    setTimeout(() => {
      onSwitchMode("login")
    }, 3000)
  }

  const handleBackToRequest = () => {
    setCurrentStep(STEPS.REQUEST_OTP)
  }

  // --- Render Steps ---

  const renderSuccess = () => (
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

  if (currentStep === STEPS.SUCCESS) {
    return renderSuccess()
  }

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

      {currentStep === STEPS.REQUEST_OTP && (
        <RequestOtpStep onSuccess={handleEmailSubmitted} />
      )}

      {currentStep === STEPS.VERIFY_OTP && (
        <VerifyOtpStep
          email={email}
          onSuccess={handleOtpVerified}
          onBack={handleBackToRequest}
        />
      )}

      {currentStep === STEPS.RESET_PASSWORD && (
        <ResetPasswordFormStep
          email={email}
          token={token}
          onSuccess={handlePasswordResetSuccess}
        />
      )}
    </AuthPopupAnim>
  )
}

export default ResetPasswordPopup
