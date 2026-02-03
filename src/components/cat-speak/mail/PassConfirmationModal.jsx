import React, { useState } from "react"
import { Modal, Button, Radio } from "antd"
import { useLanguage } from "@/context/LanguageContext"

const PassConfirmationModal = ({ open, onResult }) => {
  const { t } = useLanguage()
  const [reportReason, setReportReason] = useState(null)

  const handleConfirm = () => {
    onResult(true) // Confirmed pass
    setReportReason(null)
  }

  const handleCancel = () => {
    onResult(false) // Cancelled
    setReportReason(null)
  }

  return (
    <Modal
      title={t.catSpeak.passConfirmationTitle}
      open={open}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          {t.catSpeak.cancel}
        </Button>,
        <Button
          key="confirm"
          type="primary"
          className="bg-[#990011] hover:!bg-[#7a000d]"
          onClick={handleConfirm}
        >
          {t.catSpeak.confirm}
        </Button>,
      ]}
      centered
      destroyOnClose
    >
      <div className="py-4">
        <Radio.Group
          onChange={(e) => setReportReason(e.target.value)}
          value={reportReason}
        >
          <Radio
            value="inappropriate_language"
            onClick={() => {
              if (reportReason === "inappropriate_language") {
                setReportReason(null)
              }
            }}
          >
            {t.catSpeak.inappropriateLanguage}
          </Radio>
        </Radio.Group>
      </div>
    </Modal>
  )
}

export default PassConfirmationModal
