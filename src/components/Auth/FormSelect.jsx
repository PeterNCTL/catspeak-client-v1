import { Form, Select, ConfigProvider } from "antd"
import colors from "@/utils/colors"

const FormSelect = ({ name, label, placeholder, rules, options }) => {
  return (
    <Form.Item
      name={name}
      label={
        <span className="text-sm font-semibold text-gray-700">{label}</span>
      }
      rules={rules}
    >
      <ConfigProvider
        theme={{
          components: {
            Select: {
              controlHeight: 48,
              borderRadius: 9999,
              controlPaddingHorizontal: 16,
              fontSize: 16, // Match input text size
            },
          },
        }}
      >
        <Select
          placeholder={placeholder}
          popupMatchSelectWidth={false}
          getPopupContainer={(trigger) => trigger.parentNode}
          style={{
            borderColor: colors.border,
            borderRadius: "9999px",
            fontSize: "16px", // Ensure text size matches
          }}
          className="w-full text-base"
          dropdownStyle={{ zIndex: 9999 }}
          options={options}
        />
      </ConfigProvider>
    </Form.Item>
  )
}

export default FormSelect
