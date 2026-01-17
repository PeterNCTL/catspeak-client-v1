import React, { useState, useEffect } from "react"
import { FiX } from "react-icons/fi"
import { MailOutlined, LockOutlined, SafetyOutlined } from "@ant-design/icons"
import { useLanguage } from "@context/LanguageContext.jsx"
import { Form, Input, Button, Steps, message } from "antd"
import AuthPopupAnim from "./AuthPopupAnim"

const ForgotPasswordPopup = ({ onClose, onSwitchMode }) => {
    const { t } = useLanguage()
    const authText = t.auth

    const [currentStep, setCurrentStep] = useState(0)
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [countdown, setCountdown] = useState(0)
    const [form] = Form.useForm()

    // Countdown timer for OTP
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown])

    // Step 1: Request OTP
    const handleRequestOtp = async (values) => {
        try {
            setEmail(values.email)
            // TODO: API call to /api/auth/forgot-password
            // await forgotPasswordApi({ email: values.email })

            message.success("OTP has been sent to your email!")
            setCountdown(300) // 5 minutes countdown
            setCurrentStep(1)
            form.resetFields()
        } catch (err) {
            console.error("Request OTP failed:", err)
            message.error("Failed to send OTP. Please try again.")
        }
    }

    // Step 2: Verify OTP
    const handleVerifyOtp = async (values) => {
        try {
            setOtp(values.otp)
            // TODO: API call to /api/auth/verify-reset-otp
            // await verifyResetOtpApi({ email, token: values.otp })

            message.success("OTP verified successfully!")
            setCurrentStep(2)
            form.resetFields()
        } catch (err) {
            console.error("Verify OTP failed:", err)
            message.error("Invalid OTP. Please try again.")
        }
    }

    // Step 3: Reset Password
    const handleResetPassword = async (values) => {
        try {
            // TODO: API call to /api/auth/reset-password
            // await resetPasswordApi({ email, token: otp, newPassword: values.newPassword })

            message.success("Password reset successfully!")
            setTimeout(() => {
                onClose()
                onSwitchMode("login")
            }, 1500)
        } catch (err) {
            console.error("Reset password failed:", err)
            message.error("Failed to reset password. Please try again.")
        }
    }

    const handleResendOtp = async () => {
        try {
            // TODO: API call to /api/auth/forgot-password
            // await forgotPasswordApi({ email })

            message.success("OTP has been resent to your email!")
            setCountdown(300)
        } catch (err) {
            console.error("Resend OTP failed:", err)
            message.error("Failed to resend OTP. Please try again.")
        }
    }

    // Format countdown as MM:SS
    const formatCountdown = () => {
        const minutes = Math.floor(countdown / 60)
        const seconds = countdown % 60
        return `${minutes}:${seconds.toString().padStart(2, "0")}`
    }

    const steps = [
        {
            title: authText.stepEmail,
            icon: <MailOutlined />,
        },
        {
            title: authText.stepVerifyOtp,
            icon: <SafetyOutlined />,
        },
        {
            title: authText.stepNewPassword,
            icon: <LockOutlined />,
        },
    ]

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
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
                            name="request-otp"
                            layout="vertical"
                            onFinish={handleRequestOtp}
                            className="mt-6"
                        >
                            <Form.Item
                                name="email"
                                label={<span className="text-sm font-semibold text-gray-700">{authText.emailLabel}</span>}
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
                                    className="h-12 text-base font-bold uppercase tracking-wider rounded-full shadow-lg border-none bg-gradient-to-r from-[#f08d1d] to-[#f4ab1b] hover:shadow-xl"
                                >
                                    {authText.sendOtpButton}
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

            case 1:
                return (
                    <div className="animate-fadeIn">
                        <h2 className="text-center text-3xl font-black text-[#8f0d15]">
                            {authText.forgotStep2Title}
                        </h2>
                        <p className="mt-3 text-center text-sm text-gray-600">
                            {authText.forgotStep2Subtitle} <strong>{email}</strong>
                        </p>
                        {countdown > 0 && (
                            <div className="mt-4 flex justify-center">
                                <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-50 border border-orange-200">
                                    <SafetyOutlined className="text-orange-500 mr-2" />
                                    <span className="text-sm font-semibold text-orange-700">
                                        {authText.codeExpiresIn} {formatCountdown()}
                                    </span>
                                </div>
                            </div>
                        )}

                        <Form
                            form={form}
                            name="verify-otp"
                            layout="vertical"
                            onFinish={handleVerifyOtp}
                            className="mt-6"
                        >
                            <Form.Item
                                name="otp"
                                label={<span className="text-sm font-semibold text-gray-700">{authText.otpLabel}</span>}
                                rules={[
                                    {
                                        required: true,
                                        message: "Please input your OTP!",
                                    },
                                    {
                                        len: 6,
                                        message: "OTP must be 6 digits!",
                                    },
                                ]}
                            >
                                <Input
                                    prefix={<SafetyOutlined className="text-gray-400" />}
                                    placeholder={authText.otpPlaceholder}
                                    maxLength={6}
                                    className="rounded-full px-4 py-3 text-center text-xl tracking-widest font-bold"
                                />
                            </Form.Item>

                            <Form.Item className="mb-0">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    className="h-12 text-base font-bold uppercase tracking-wider rounded-full shadow-lg border-none bg-gradient-to-r from-[#f08d1d] to-[#f4ab1b] hover:shadow-xl"
                                >
                                    {authText.verifyOtpButton}
                                </Button>
                            </Form.Item>
                        </Form>

                        <div className="mt-6 text-center space-y-2">
                            <p className="text-sm text-gray-600">
                                {authText.didntReceiveCode}{" "}
                                <button
                                    onClick={handleResendOtp}
                                    disabled={countdown > 0}
                                    className={`font-semibold ${countdown > 0
                                            ? "text-gray-400 cursor-not-allowed"
                                            : "text-[#f08d1d] hover:text-[#d87c15]"
                                        }`}
                                >
                                    {authText.resendOtp}
                                </button>
                            </p>
                            <button
                                onClick={() => {
                                    setCurrentStep(0)
                                    form.resetFields()
                                    setCountdown(0)
                                }}
                                className="text-sm font-semibold text-[#f08d1d] hover:text-[#d87c15]"
                            >
                                ← {authText.changeEmail}
                            </button>
                        </div>
                    </div>
                )

            case 2:
                return (
                    <div className="animate-fadeIn">
                        <h2 className="text-center text-3xl font-black text-[#8f0d15]">
                            {authText.forgotStep3Title}
                        </h2>
                        <p className="mt-3 text-center text-sm text-gray-600">
                            {authText.forgotStep3Subtitle}
                        </p>

                        <Form
                            form={form}
                            name="reset-password"
                            layout="vertical"
                            onFinish={handleResetPassword}
                            className="mt-6"
                        >
                            <Form.Item
                                name="newPassword"
                                label={
                                    <span className="text-sm font-semibold text-gray-700">
                                        {authText.newPasswordLabel}
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
                                    placeholder={authText.newPasswordPlaceholder}
                                    className="rounded-full px-4 py-3"
                                />
                            </Form.Item>

                            <Form.Item
                                name="confirmPassword"
                                label={
                                    <span className="text-sm font-semibold text-gray-700">
                                        {authText.confirmPasswordLabel}
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
                                                new Error("The two passwords do not match!")
                                            )
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="text-gray-400" />}
                                    placeholder={authText.confirmPasswordPlaceholder}
                                    className="rounded-full px-4 py-3"
                                />
                            </Form.Item>

                            <Form.Item className="mb-0">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    className="h-12 text-base font-bold uppercase tracking-wider rounded-full shadow-lg border-none bg-gradient-to-r from-[#f08d1d] to-[#f4ab1b] hover:shadow-xl"
                                >
                                    {authText.resetPasswordButton}
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                )

            default:
                return null
        }
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

            <div className="mb-8 px-4">
                <Steps current={currentStep} items={steps} />
            </div>

            {renderStepContent()}
        </AuthPopupAnim>
    )
}

export default ForgotPasswordPopup
