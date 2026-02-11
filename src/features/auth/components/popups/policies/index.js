import PrivacyPolicy from "./PrivacyPolicy"
import TermsOfService from "./TermsOfService"
import PaymentPolicy from "./PaymentPolicy"
import IntellectualPropertyPolicy from "./IntellectualPropertyPolicy"

// Policy mapping configuration
// Add new policies here by mapping the title text to the component
export const policyComponents = {
  // Privacy Policy - matches Vietnamese, English, and Chinese
  "Chính sách bảo mật": PrivacyPolicy,
  "Privacy Policy": PrivacyPolicy,
  隐私政策: PrivacyPolicy,

  // Terms of Service - matches Vietnamese, English, and Chinese
  "Điều khoản dịch vụ": TermsOfService,
  "Terms of Service": TermsOfService,
  服务条款: TermsOfService,

  // Payment Policy - matches Vietnamese, English, and Chinese
  "Chính sách thanh toán": PaymentPolicy,
  "Payment Policy": PaymentPolicy,
  支付政策: PaymentPolicy,

  // Intellectual Property Rights - matches Vietnamese, English, and Chinese
  "Quyền sở hữu trí tuệ": IntellectualPropertyPolicy,
  "Intellectual Property Rights": IntellectualPropertyPolicy,
  知识产权: IntellectualPropertyPolicy,
}

// Helper function to get policy component by title
export const getPolicyComponent = (title) => {
  if (!title) return null

  // Try exact match first
  if (policyComponents[title]) {
    return policyComponents[title]
  }

  // Try partial match (for flexibility)
  const matchedKey = Object.keys(policyComponents).find(
    (key) => title.includes(key) || key.includes(title),
  )

  return matchedKey ? policyComponents[matchedKey] : null
}

export {
  PrivacyPolicy,
  TermsOfService,
  PaymentPolicy,
  IntellectualPropertyPolicy,
}
