const fs = require("fs")

const viPaymentPolicy = {
  title: "Chính sách thanh toán và hoàn tiền - Cat Speak",
  intro:
    "Cat Speak - nền tảng cộng đồng kết nối, giao tiếp đa ngôn ngữ và văn hóa toàn cầu - Chính sách Thanh toán này quy định các điều kiện áp dụng đối với việc thanh toán khi sử dụng các dịch vụ trả phí trên nền tảng Cat Speak. Việc thực hiện thanh toán đồng nghĩa với việc NGƯỜI DÙNG đồng ý với Chính sách này và Điều khoản Dịch vụ của Cat Speak. Cập nhật lần cuối: 23/02/2026",
  section1: {
    title: "1. THANH TOÁN GÓI DỊCH VỤ (SUBSCRIPTION - B2C)",
    intro: "Cat Speak vận hành theo mô hình kết hợp:",
    items1: [
      "Dịch vụ đăng ký (Subscription) - cung cấp quyền truy cập vào các tính năng cao cấp, AI, công cụ hỗ trợ.",
      "Nền tảng trung gian (Marketplace) - kết nối người dùng để giao tiếp và thực hiện giao dịch có tính phí với nhau theo quy định của CAT SPEAK.",
      "Giải pháp doanh nghiệp (B2B) - cung cấp dịch vụ, tài khoản hoặc giấy phép sử dụng theo hợp đồng riêng.",
    ],
    items2: [
      "Các gói dịch vụ được cung cấp theo mô hình trả trước.",
      "Quyền truy cập chỉ được kích hoạt khi thanh toán thành công.",
      "Gói dịch vụ có thể tự động gia hạn nếu người dùng không hủy trước ngày gia hạn.",
      "Phí đã thanh toán không được hoàn lại, trừ khi thuộc trường hợp được xem xét theo Mục 7.",
    ],
  },
  section2: {
    title: "2. THANH TOÁN TRÊN MARKETPLACE (P2P)",
    items: [
      "Người dùng có thể thực hiện thanh toán cho người dùng khác thông qua hệ thống của Cat Speak.",
      "Cat Speak đóng vai trò trung gian xử lý giao dịch và có thể khấu trừ phí nền tảng trước khi chuyển phần còn lại cho bên cung cấp dịch vụ.",
      "Cat Speak không phải là bên trực tiếp cung cấp dịch vụ giữa các Người dùng.",
    ],
    rightsTitle: "Cat Speak có quyền:",
    rights: [
      "Tạm giữ khoản thanh toán để xác minh;",
      "Đóng băng giao dịch khi có tranh chấp;",
      "Yêu cầu cung cấp bằng chứng;",
      "Thông báo, đệ trình cho cơ quan Nhà nước có thẩm quyền nếu phát hiện bất kỳ dấu hiệu vi phạm pháp luật Việt Nam.",
    ],
  },
  section3: {
    title: "3. THANH TOÁN DOANH NGHIỆP (B2B)",
    items: [
      "Các điều khoản thanh toán, thời hạn và hoàn tiền đối với doanh nghiệp được điều chỉnh theo hợp đồng riêng.",
      "Trong trường hợp có khác biệt giữa hợp đồng B2B và Chính sách này, hợp đồng B2B sẽ được ưu tiên áp dụng.",
    ],
  },
  section4: {
    title: "4. CHÍNH SÁCH HOÀN TIỀN - SUBSCRIPTION (B2C)",
    generalRuleBold: "1. Nguyên tắc chung:",
    generalRuleText:
      "Các khoản phí đã thanh toán không được hoàn lại, trừ khi pháp luật yêu cầu hoặc thuộc trường hợp đặc biệt dưới đây.",
    subjectiveRuleBold: "2. Không hoàn tiền vì lý do chủ quan:",
    subjectiveRuleText:
      "Cat Speak không hoàn tiền trong các trường hợp Người dùng:",
    reasons: [
      "Không thích trải nghiệm;",
      "Không đạt kỳ vọng cá nhân;",
      "Không sử dụng dịch vụ;",
      "Thay đổi nhu cầu cá nhân.",
    ],
    windowTitle: "3. Cửa sổ hoàn tiền cho người dùng mới",
    windowIntro:
      "Người dùng mới có thể yêu cầu hoàn tiền trong thời hạn 07 (bảy) ngày kể từ lần thanh toán đầu tiên nếu Người dùng có đề nghị và đáp ứng toàn bộ quy định như sau:",
    windowItems: [
      "Chưa sử dụng quá 30% quyền lợi;",
      "Không vi phạm Điều khoản và/hoặc quy định nào;",
      "Có bằng chứng lỗi kỹ thuật nghiêm trọng.",
    ],
    windowNote:
      "CAT SPEAK có toàn quyền quyết định khi xem xét và quyết định của CAT SPEAK trong trường hợp này là quyết định cuối cùng và Người dùng không có quyền khiếu nại.",
  },
  section5: {
    title: "5. HOÀN TIỀN TRONG MARKETPLACE",
    paragraph1: "Hoàn tiền cho Người dùng chỉ được xem xét khi:",
    items1: [
      "Dịch vụ không được thực hiện bởi Người dùng cung cấp dịch vụ;",
      "Có đề nghị gửi cho CAT SPEAK từ Người dùng;",
      "Có bằng chứng xác thực về việc thanh toán và vi phạm quy định của CAT SPEAK và/hoặc quy định pháp luật có liên quan. Mọi bằng chứng phải được gửi cho CAT SPEAK theo quy định trước khi Người dùng đề nghị hoàn tiền.",
    ],
    paragraph2: "CAT SPEAK không chịu trách nhiệm hoàn tiền nếu:",
    items2: [
      "Tranh chấp mang tính chủ quan của Người dùng;",
      "Giao dịch và/hoặc dịch vụ đã hoàn tất giữa các Người dùng;",
      "Không có bằng chứng hợp lý và xác thực về vi phạm.",
    ],
    note: "Cat Speak có thể hỗ trợ hòa giải nhưng không có nghĩa vụ đứng ra bồi thường thay cho các bên.",
  },
  section6: {
    title: "6. YÊU CẦU BẰNG CHỨNG",
    intro: "Người dùng có thể đề nghị cung cấp thông tin có liên quan:",
    items: [
      "Mã giao dịch;",
      "Hóa đơn;",
      "Ảnh chụp màn hình;",
      "Lịch sử trao đổi;",
      "Mô tả chi tiết sự cố.",
    ],
    note: "CAT SPEAK có toàn quyền xem xét, từ chối xử lý nếu không đủ căn cứ hoặc có dấu hiệu gian lận, không trung thực.",
  },
  section7: {
    title: "7. HOÀN TIỀN VÀ GIAN LẬN",
    items: [
      "CAT SPEAK có quyền đình chỉ tài khoản nếu phát hiện bất kỳ hành vi lạm dụng hoàn tiền hoặc đề nghị hoàn tiền không hợp lệ.",
      "CAT SPEAK chỉ hoàn tiền cho Người dùng vào đúng tài khoản đã chuyển khoản cho CAT SPEAK trước đó và đã ghi nhận giao dịch thành công trên hệ thống cơ sở dữ liệu.",
      "Người dùng có thể phải chịu các chi phí phát sinh liên quan đến việc giải quyết tranh chấp thanh toán.",
    ],
  },
  section8: {
    title: "8. GIỚI HẠN TRÁCH NHIỆM VỀ AI (Trí tuệ nhân tạo)",
    items: [
      "Nội dung và phản hồi từ AI chỉ mang tính hỗ trợ học tập và tham khảo;",
      "Không đảm bảo tính chính xác tuyệt đối về hình thức, nội dung;",
      "CAT SPEAK không chịu trách nhiệm đối với bất kỳ quyết định của Người dùng dựa trên nội dung do AI tạo ra hay cung cấp cho Người dùng.",
    ],
  },
  section9: {
    title: "9. LIÊN HỆ",
    intro:
      "Nếu có câu hỏi hoặc yêu cầu liên quan đến chính sách thanh toán, vui lòng liên hệ:",
    contact: {
      email: "Email:",
      website: "Website:",
      fanpage: "Fanpage:",
      hotline: "Hotline:",
    },
    copyright: "@Copyright 2026 | Cat Speak - I speak you speak we peak",
  },
}

const enPaymentPolicy = {
  title: "Payment and Refund Policy - Cat Speak",
  intro:
    "Cat Speak - a global community platform connecting languages and cultures - This Payment Policy specifies the conditions applicable to payments when using paid services on the Cat Speak platform. Making a payment means the USER agrees to this Policy and Cat Speak's Terms of Service. Last updated: 02/23/2026",
  section1: {
    title: "1. SERVICE PACKAGE PAYMENT (SUBSCRIPTION - B2C)",
    intro: "Cat Speak operates on a hybrid model:",
    items1: [
      "Subscription service - provides access to premium features, AI, supporting tools.",
      "Intermediary platform (Marketplace) - connects users to communicate and perform paid transactions with each other according to CAT SPEAK's regulations.",
      "Enterprise solutions (B2B) - provides services, accounts or licenses to use under a separate contract.",
    ],
    items2: [
      "Service packages are provided on a prepaid model.",
      "Access is only activated upon successful payment.",
      "Service packages may self-renew if the user does not cancel before the renewal date.",
      "Paid fees are non-refundable, except in cases considered under Section 7.",
    ],
  },
  section2: {
    title: "2. PAYMENT ON MARKETPLACE (P2P)",
    items: [
      "Users can make payments to other users through Cat Speak's system.",
      "Cat Speak acts as an intermediary processing transactions and may deduct a platform fee before transferring the remainder to the service provider.",
      "Cat Speak is not a direct service provider between Users.",
    ],
    rightsTitle: "Cat Speak has the right to:",
    rights: [
      "Hold payments for verification;",
      "Freeze transactions when there is a dispute;",
      "Require provision of evidence;",
      "Notify and submit to competent State authorities if detecting any signs of violation of Vietnamese law.",
    ],
  },
  section3: {
    title: "3. ENTERPRISE PAYMENT (B2B)",
    items: [
      "Payment terms, deadlines, and refunds for businesses are governed by separate contracts.",
      "In case of discrepancy between the B2B contract and this Policy, the B2B contract will prevail.",
    ],
  },
  section4: {
    title: "4. REFUND POLICY - SUBSCRIPTION (B2C)",
    generalRuleBold: "1. General principle:",
    generalRuleText:
      "Paid fees are non-refundable, unless required by law or in special cases below.",
    subjectiveRuleBold: "2. No refund for subjective reasons:",
    subjectiveRuleText: "Cat Speak will not issue a refund if the User:",
    reasons: [
      "Does not like the experience;",
      "Does not meet personal expectations;",
      "Does not use the service;",
      "Changes personal needs.",
    ],
    windowTitle: "3. Refund window for new users",
    windowIntro:
      "New users may request a refund within 07 (seven) days from the first payment if the User requests and meets all of the following requirements:",
    windowItems: [
      "Has not used more than 30% of the benefits;",
      "Has not violated any Terms and/or regulations;",
      "Has evidence of a serious technical error.",
    ],
    windowNote:
      "CAT SPEAK has sole discretion in considering, and CAT SPEAK's decision in this case is final, and the User has no right to complain.",
  },
  section5: {
    title: "5. REFUNDS IN MARKETPLACE",
    paragraph1: "Refunds for Users will only be considered when:",
    items1: [
      "The service was not performed by the User providing the service;",
      "There is a request sent to CAT SPEAK from the User;",
      "There is authentic evidence of payment and violation of CAT SPEAK's regulations and/or relevant legal regulations. All evidence must be sent to CAT SPEAK according to regulations before the User requests a refund.",
    ],
    paragraph2: "CAT SPEAK is not responsible for refunding if:",
    items2: [
      "The dispute is subjective in nature for the User;",
      "The transaction and/or service was completed between Users;",
      "There is no reasonable and authentic evidence of a violation.",
    ],
    note: "Cat Speak can support mediation but has no obligation to compensate on behalf of the parties.",
  },
  section6: {
    title: "6. EVIDENCE REQUIREMENTS",
    intro: "Users may request to provide relevant information:",
    items: [
      "Transaction code;",
      "Invoice;",
      "Screenshots;",
      "Exchange history;",
      "Detailed description of the incident.",
    ],
    note: "CAT SPEAK has the sole right to review and refuse processing if there are insufficient grounds or signs of fraud or dishonesty.",
  },
  section7: {
    title: "7. REFUNDS AND FRAUD",
    items: [
      "CAT SPEAK reserves the right to suspend an account if it detects any abuse of refunds or valid refund requests.",
      "CAT SPEAK will only refund the User to the correct account that transferred money to CAT SPEAK previously and has recorded a successful transaction on the database system.",
      "Users may have to bear costs incurred related to the resolution of payment disputes.",
    ],
  },
  section8: {
    title: "8. LIMITATION OF LIABILITY REGARDING AI (Artificial Intelligence)",
    items: [
      "Content and responses from AI are for academic support and reference only;",
      "No absolute guarantee of accuracy in form or content;",
      "CAT SPEAK assumes no responsibility for any decisions made by the User based on content generated by or provided to the User by AI.",
    ],
  },
  section9: {
    title: "9. CONTACT",
    intro:
      "If you have any questions or requests related to the payment policy, please contact:",
    contact: {
      email: "Email:",
      website: "Website:",
      fanpage: "Fanpage:",
      hotline: "Hotline:",
    },
    copyright: "@Copyright 2026 | Cat Speak - I speak you speak we peak",
  },
}

const zhPaymentPolicy = {
  title: "支付和退款政策 - Cat Speak",
  intro:
    "Cat Speak - 连接语言和文化的全球社区平台 - 本支付政策规定了在Cat Speak平台上使用付费服务时适用支付的条件。进行支付即表示用户同意本政策和Cat Speak的服务条款。最后更新：2026年02月23日",
  section1: {
    title: "1. 服务包支付 (订阅 - B2C)",
    intro: "Cat Speak采用混合模式运营：",
    items1: [
      "订阅服务 - 提供高级功能、AI、支持工具的访问权限。",
      "中介平台 (Marketplace) - 连接用户，根据CAT SPEAK的规定进行沟通和执行付费交易。",
      "企业解决方案 (B2B) - 根据单独的合同提供服务、账户或使用许可。",
    ],
    items2: [
      "服务包采用预付模式提供。",
      "访问权限仅在付款成功后激活。",
      "如果用户在续订日期前未取消，服务包可能会自动续订。",
      "已支付费用不可退还，第7节所述情况除外。",
    ],
  },
  section2: {
    title: "2. 平台支付 (P2P)",
    items: [
      "用户可以通过Cat Speak的系统向其他用户进行支付。",
      "Cat Speak作为处理交易的中介，可以在将剩余款项转给服务提供商之前扣除平台费用。",
      "Cat Speak不是用户之间的直接服务提供商。",
    ],
    rightsTitle: "Cat Speak有权：",
    rights: [
      "在验证期间扣留付款；",
      "发生纠纷时冻结交易；",
      "要求提供证据；",
      "若发现任何违反越南法律的迹象，通知并提交给国家有关主管机关。",
    ],
  },
  section3: {
    title: "3. 企业支付 (B2B)",
    items: [
      "企业的支付条款、期限和退款受单独合同的约束。",
      "如果B2B合同与本政策存在差异，将以B2B合同为准。",
    ],
  },
  section4: {
    title: "4. 退款政策 - 订阅 (B2C)",
    generalRuleBold: "1. 一般原则：",
    generalRuleText: "已支付的费用不可退还，除非法律要求或以下特殊情况。",
    subjectiveRuleBold: "2. 因主观原因不予退款：",
    subjectiveRuleText: "如果用户出现以下情况，Cat Speak将不予退款：",
    reasons: [
      "不喜欢该体验；",
      "不符合个人期望；",
      "未使用服务；",
      "个人需求改变。",
    ],
    windowTitle: "3. 新用户退款窗口",
    windowIntro:
      "如果用户要求并符合以下所有要求，新用户可以在首次付款后的 07（七）天内请求退款：",
    windowItems: [
      "未享受超过30%的福利；",
      "未违反任何条款和/或规定；",
      "有严重技术错误的证据。",
    ],
    windowNote:
      "CAT SPEAK完全有权进行考虑，CAT SPEAK在这种情况下的决定为最终决定，用户无权投诉。",
  },
  section5: {
    title: "5. 平台内退款",
    paragraph1: "只有在以下情况才会考虑为用户退款：",
    items1: [
      "服务提供方用户未执行服务；",
      "用户向 CAT SPEAK 提交了请求；",
      "有支付的确凿证据，以及违反CAT SPEAK规定和/或相关法律规定的证据。所有证据必须在用户请求退款前按照规定发送给CAT SPEAK。",
    ],
    paragraph2: "如果出现以下情况，CAT SPEAK不承担退款责任：",
    items2: [
      "该纠纷对用户来说具有主观性质；",
      "交易和/或服务已在用户之间完成；",
      "缺乏合理、真实的违规证据。",
    ],
    note: "Cat Speak可以支持调解，但没有代替各方进行赔偿的义务。",
  },
  section6: {
    title: "6. 证据要求",
    intro: "用户可以要求提供相关信息：",
    items: [
      "交易代码；",
      "发票；",
      "截图；",
      "交流历史记录；",
      "事件的详细描述。",
    ],
    note: "如果证据不足或有欺诈、不诚实迹象，CAT SPEAK有全权审查并拒绝处理。",
  },
  section7: {
    title: "7. 退款和欺诈",
    items: [
      "如果发现任何滥用退款或有效退款请求的行为，CAT SPEAK保留暂停账户的权利。",
      "CAT SPEAK只向之前将资金转账给CAT SPEAK并在数据库系统上记录成功交易的账户进行退款。",
      "用户可能须要承担与解决支付纠纷相关的费用。",
    ],
  },
  section8: {
    title: "8. 关于AI (人工智能) 的责任限制",
    items: [
      "AI的内容和回复仅供学习支持和参考；",
      "无法绝对保证内容或形式的准确性；",
      "用户因使用AI生成或提供给用户的内容而做出的任何决定，CAT SPEAK不承担任何责任。",
    ],
  },
  section9: {
    title: "9. 联系方式",
    intro: "如果您有任何与支付政策相关的问题或请求，请联系：",
    contact: {
      email: "电子邮件：",
      website: "网站：",
      fanpage: "粉丝页：",
      hotline: "热线：",
    },
    copyright: "@Copyright 2026 | Cat Speak - I speak you speak we peak",
  },
}

function updateFile(filePath, paymentPolicy) {
  let content = fs.readFileSync(filePath, "utf8")
  if (!content.includes("paymentPolicy: {")) {
    content = content.replace(
      "export default {",
      "export default {\n  paymentPolicy: " +
        JSON.stringify(paymentPolicy, null, 2) +
        ",",
    )
    fs.writeFileSync(filePath, content)
  }
}

updateFile(
  "c:/Codes/Cat Speak/src/shared/i18n/locales/vi/components/policies.js",
  viPaymentPolicy,
)
updateFile(
  "c:/Codes/Cat Speak/src/shared/i18n/locales/en/components/policies.js",
  enPaymentPolicy,
)
updateFile(
  "c:/Codes/Cat Speak/src/shared/i18n/locales/zh/components/policies.js",
  zhPaymentPolicy,
)
