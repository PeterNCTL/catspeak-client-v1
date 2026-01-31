import React, { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Modal, Form, Input, Button, Select } from "antd"
import { useCreateVideoSessionMutation } from "@/store/api/videoSessionsApi"
import { useLanguage } from "@/context/LanguageContext"

const LEVELS = {
  English: ["A1", "A2", "B1", "B2", "C1", "C2"],
  Chinese: ["HSK 1", "HSK 2", "HSK 3", "HSK 4", "HSK 5", "HSK 6"],
  Vietnamese: ["Beginner", "Intermediate", "Advanced"],
}

const TOPICS = [
  "Daily Greetings",
  "Food & Drinks",
  "Travel",
  "Weather",
  "Career",
  "Current Events",
]

const CreateRoomModal = ({ open, onCancel }) => {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [createVideoSession, { isLoading }] = useCreateVideoSessionMutation()
  const [searchParams] = useSearchParams()

  const urlLanguage = searchParams.get("language")
  const defaultLanguage = urlLanguage
    ? urlLanguage.charAt(0).toUpperCase() + urlLanguage.slice(1)
    : "English"

  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage)
  const [selectedLevel, setSelectedLevel] = useState("")

  // Close modal logic wrapper to reset form if needed or just close
  const handleCancel = () => {
    onCancel()
    // Optional: reset form on close
    // form.resetFields()
    // setSelectedLevel("")
  }

  // Sync state with form
  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        languageType: selectedLanguage,
        requiredLevel: selectedLevel,
      })
    }
  }, [selectedLanguage, selectedLevel, form, open])

  // Update selectedLanguage if URL changes while modal is open (optional but good for consistency)
  useEffect(() => {
    if (urlLanguage) {
      const lang = urlLanguage.charAt(0).toUpperCase() + urlLanguage.slice(1)
      setSelectedLanguage(lang)
    }
  }, [urlLanguage])

  const onFinish = async (values) => {
    if (!selectedLanguage || !selectedLevel) {
      return
    }

    try {
      const response = await createVideoSession({
        name: values.name,
        roomType: 2, // Group room
        languageType: selectedLanguage,
        requiredLevel: selectedLevel,
        topic: values.topic,
      }).unwrap()

      const sessionId = response.sessionId || response.id
      handleCancel() // Close modal

      if (sessionId) {
        navigate(`/meet/${sessionId}`)
      }
    } catch (err) {
      console.error("Failed to create room:", err)
    }
  }

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={600}
      centered
      destroyOnHidden
      maskClosable={false}
      className="create-room-modal"
    >
      <div className="p-4">
        <Form
          form={form}
          onFinish={onFinish}
          initialValues={{ languageType: defaultLanguage }}
          layout="vertical"
          className="space-y-8"
        >
          {/* Section 1: Room Name */}
          <div className="text-center">
            <h2 className="text-2xl font-black text-gray-800 mb-4">
              {t.rooms.createRoom.title}
            </h2>
            <Form.Item
              name="name"
              className="max-w-md mx-auto mb-0"
              rules={[
                {
                  required: true,
                  message: t.rooms.createRoom.validation.required,
                },
                { min: 3, message: t.rooms.createRoom.validation.minLength },
              ]}
            >
              <Input
                placeholder={t.rooms.createRoom.namePlaceholder}
                className="
                  text-center text-xl font-bold py-3
                  bg-white border hover:border-cath-red-700 focus:border-cath-red-700
                  border-[#E5E5E5] rounded-full shadow-sm focus:shadow-md transition-all
                "
              />
            </Form.Item>
          </div>

          {/* Section 1.5: Topic Selection */}
          <div className="text-center">
            <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-4">
              Topic
            </h3>
            <Form.Item
              name="topic"
              className="max-w-md mx-auto mb-0"
              rules={[
                {
                  required: true,
                  message: "Please select a topic",
                },
              ]}
            >
              <Select
                placeholder="Select a topic"
                size="large"
                className="w-full text-left"
                style={{ borderRadius: "9999px" }}
              >
                {TOPICS.map((topic) => (
                  <Select.Option key={topic} value={topic}>
                    {topic}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          {/* Section 2: Level Selection */}
          <div className="text-center">
            <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-4">
              {t.rooms.createRoom.requiredLevel} ({selectedLanguage})
            </h3>

            <Form.Item name="requiredLevel" hidden>
              <Input />
            </Form.Item>

            <div className="flex flex-wrap justify-center gap-2">
              {LEVELS[selectedLanguage]?.map((level) => {
                const isSelected = selectedLevel === level
                return (
                  <div
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`
                      cursor-pointer px-5 py-2 rounded-full font-bold text-sm border-2 transition-all
                      ${
                        isSelected
                          ? "bg-cath-red-700 border-cath-red-700 text-white"
                          : "bg-white border-[#E5E5E5] text-gray-500 hover:border-gray-300"
                      }
                    `}
                  >
                    {level}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-3 pt-4">
            <Button
              size="large"
              type="text"
              className="h-10 px-6 rounded-full font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              onClick={handleCancel}
            >
              {t.rooms.createRoom.cancel}
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              disabled={!selectedLevel || !selectedLanguage}
              className="h-10 px-8 rounded-full font-bold bg-cath-red-700 hover:!bg-cath-red-500 !border-none disabled:!bg-gray-200 disabled:!text-gray-400"
            >
              {t.rooms.createRoom.create}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  )
}

export default CreateRoomModal
