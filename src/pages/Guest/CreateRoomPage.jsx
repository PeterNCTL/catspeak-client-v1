import React, { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Form, Input, Button, message } from "antd"
import { useCreateVideoSessionMutation } from "@/store/api/videoSessionsApi"

const CreateRoomPage = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [createVideoSession, { isLoading }] = useCreateVideoSessionMutation()

  // --- Configuration ---
  // --- Configuration ---

  const LEVELS = {
    English: ["Beginner", "Intermediate", "Advanced"],
    Chinese: ["HSK 1", "HSK 2", "HSK 3", "HSK 4", "HSK 5", "HSK 6"],
    Vietnamese: ["Beginner", "Intermediate", "Advanced"],
  }

  const [searchParams] = useSearchParams()
  const urlLanguage = searchParams.get("language")
  const defaultLanguage = urlLanguage
    ? urlLanguage.charAt(0).toUpperCase() + urlLanguage.slice(1)
    : "English"

  // --- State ---
  const [selectedLanguage, setSelectedLanguage] = useState(defaultLanguage)
  const [selectedLevel, setSelectedLevel] = useState("")

  // Sync state with form
  useEffect(() => {
    form.setFieldsValue({
      languageType: selectedLanguage,
      requiredLevel: selectedLevel,
    })
  }, [selectedLanguage, selectedLevel, form])

  // --- Handlers ---
  // --- Handlers ---

  const onFinish = async (values) => {
    if (!selectedLanguage || !selectedLevel) {
      message.error("Please fill in all fields.")
      return
    }

    try {
      const response = await createVideoSession({
        name: values.name,
        roomType: 2,
        languageType: selectedLanguage,
        requiredLevel: selectedLevel,
      }).unwrap()

      const sessionId = response.sessionId || response.id
      if (sessionId) {
        navigate({
          pathname: `/meet/${sessionId}`,
          search: searchParams.toString(),
        })
      } else {
        navigate({
          pathname: "/",
          search: searchParams.toString(),
        })
      }
    } catch (err) {
      console.error("Failed to create room:", err)
      message.error("Failed to create room.")
    }
  }

  // --- Render ---
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <Form
          form={form}
          onFinish={onFinish}
          initialValues={{ languageType: "English" }}
          layout="vertical"
          className="space-y-16"
        >
          {/* Section 1: Room Name */}
          <div className="text-center">
            <h1 className="text-4xl font-black text-gray-800 mb-6">
              What's your room name?
            </h1>
            <Form.Item
              name="name"
              className="max-w-xl mx-auto mb-0"
              rules={[
                { required: true, message: "Please enter a room name" },
                { min: 3, message: "Use at least 3 characters" },
              ]}
            >
              <Input
                placeholder="e.g. Chill Practice"
                className="
                  text-center text-2xl font-bold py-4
                  bg-white border hover:border-[#990011] focus:border-[#990011]
                  border-[#E5E5E5] rounded-full shadow-sm focus:shadow-md transition-all
                "
              />
            </Form.Item>
          </div>

          {/* Section 3: Level Selection */}
          <div className="text-center">
            <h2 className="text-gray-400 font-bold uppercase tracking-widest text-sm mb-6">
              Required Level
            </h2>

            <Form.Item name="requiredLevel" hidden>
              <Input />
            </Form.Item>

            <div className="flex flex-wrap justify-center gap-3">
              {LEVELS[selectedLanguage]?.map((level) => {
                const isSelected = selectedLevel === level
                return (
                  <div
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`
                      cursor-pointer px-6 py-3 rounded-full font-bold text-base border-2 transition-all
                      ${
                        isSelected
                          ? "bg-[#990011] border-[#990011] text-white"
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

          {/* Fixed Bottom Actions */}
          {/* Fixed Bottom Actions */}
          <div className="fixed bottom-10 left-0 w-full flex justify-center gap-4 pointer-events-none z-50">
            <div className="flex gap-4 pointer-events-auto">
              <Button
                size="large"
                type="text"
                className="h-12 px-8 rounded-full font-bold text-gray-400 hover:text-gray-800 hover:bg-transparent"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                disabled={!selectedLevel || !selectedLanguage}
                className="h-12 px-10 rounded-full font-bold bg-[#990011] hover:bg-[#7a000d] !border-none disabled:!bg-gray-200 disabled:!text-gray-400"
              >
                Create Room
              </Button>
            </div>
          </div>

          {/* Spacer for bottom bar */}
          <div className="h-20" />
        </Form>
      </div>
    </div>
  )
}

export default CreateRoomPage
