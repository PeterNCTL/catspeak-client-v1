import { Input } from "antd"
import { FiSend } from "react-icons/fi"
import { useLanguage } from "@context/LanguageContext.jsx"

const ContactSection = () => {
  const { t } = useLanguage()
  const footerText = t.footer

  return (
    <div className="col-span-1 lg:col-span-4">
      <div className="font-bold text-lg uppercase text-center tracking-wide mb-4">
        {footerText.contactUs}
      </div>
      <div className="px-0 lg:px-10">
        <form className="flex flex-col gap-5">
          <Input
            placeholder={footerText.usernamePlaceholder}
            className="rounded-full border border-white/60 bg-white px-5 py-2 text-base text-gray-800 placeholder-gray-400 shadow-md hover:border-yellow-300 focus:border-yellow-300"
          />
          <Input
            placeholder={footerText.emailPlaceholder}
            className="rounded-full border border-white/60 bg-white px-5 py-2 text-base text-gray-800 placeholder-gray-400 shadow-md hover:border-yellow-300 focus:border-yellow-300"
          />
        </form>
        <div className="mt-4 flex items-center justify-between text-sm text-white/90">
          <p className="flex-1 pr-4 italic">
            <span className="font-bold text-base">Cat Speak </span>
            {footerText.contactMessage}
          </p>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-300 text-[#bc1e46] shadow-lg transition hover:scale-105"
            aria-label={footerText.sendContact}
          >
            <FiSend size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ContactSection
