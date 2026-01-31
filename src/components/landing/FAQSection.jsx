import { useState } from "react"
import { FiPlus, FiMinus } from "react-icons/fi"
import { BGTicket } from "@assets/images/home"
import { useLanguage } from "@context/LanguageContext.jsx"

const FAQSection = () => {
  const { t } = useLanguage()
  const [expandedQuestions, setExpandedQuestions] = useState(new Set())
  const [searchQuery, setSearchQuery] = useState("")

  // Handle question expansion - Independent toggle for each question
  const toggleQuestion = (index) => {
    setExpandedQuestions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  return (
    <div className="mt-12 md:mt-24 w-full px-4 md:px-8 pb-16">
      <div className="relative mx-auto max-w-screen-xl">
        {/* Background Ticket Image */}
        <div className="relative rounded-3xl overflow-hidden min-h-[600px]">
          <img
            src={BGTicket}
            alt="FAQ Background"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />

          {/* Content Overlay */}
          <div className="relative z-10 p-6 md:p-12 lg:p-16 flex flex-col h-full">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-8 md:mb-10">
              <div className="flex-1 mb-6 md:mb-0">
                {/* Corner Label with underline */}
                <div className="relative inline-block mb-3">
                  <div className="text-sm md:text-base uppercase tracking-[0.15em] text-cath-yellow-400 font-bold">
                    {t.faq.corner}
                  </div>
                  <div
                    className="absolute bottom-0 left-0 h-0.5 bg-cath-yellow-400"
                    style={{ width: "50%" }}
                  />
                </div>
                {/* Main Title */}
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  {t.faq.title}
                </h2>
              </div>

              {/* Search Bar - Positioned to overlap */}
              <div className="md:absolute md:top-8 md:right-8 lg:top-12 lg:right-12">
                <div className="relative border-2 border-cath-red-800 rounded-xl px-5 py-3.5 shadow-search flex items-center gap-3 min-w-[240px] md:min-w-[280px] transition-all hover:border-cath-red-900 hover:shadow-lg">
                  <svg
                    className="w-5 h-5 text-gray-300 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder={t.faq.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 outline-none text-white placeholder-gray-400 text-sm md:text-base bg-transparent"
                  />
                </div>
              </div>
            </div>

            {/* FAQ Questions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1 gap-x-4 md:gap-x-6 flex-1 p-4 items-start">
              {t.faq.questions.map((item, originalIndex) => {
                // Check if question matches search query
                const matchesSearch =
                  item.question
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  item.answer.toLowerCase().includes(searchQuery.toLowerCase())

                if (!matchesSearch) return null

                const isExpanded = expandedQuestions.has(originalIndex)

                return (
                  <div
                    key={originalIndex}
                    className={`rounded-xl border transition-all duration-300 ease-in-out ${
                      isExpanded
                        ? "bg-gradient-to-br from-orange-500/50 to-red-600/50 border-white/70 shadow-faq-card-expanded backdrop-blur-sm"
                        : "bg-white/10 border-white/40 hover:bg-white/15 hover:border-white/50 shadow-faq-card backdrop-blur-sm"
                    }`}
                  >
                    <button
                      onClick={() => toggleQuestion(originalIndex)}
                      className="w-full p-4 md:p-5 flex items-center justify-between text-left group"
                    >
                      <span
                        className={`flex-1 text-base md:text-lg font-bold leading-snug pr-4 ${
                          isExpanded
                            ? "text-white"
                            : "text-white group-hover:text-white/90"
                        }`}
                      >
                        {item.question}
                      </span>
                      <div className="ml-2 flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-white/20">
                        {isExpanded ? (
                          <FiMinus
                            className="w-5 h-5 text-cath-red-800"
                            aria-hidden
                          />
                        ) : (
                          <FiPlus
                            className="w-5 h-5 text-cath-yellow-400"
                            aria-hidden
                          />
                        )}
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="px-4 md:px-5 pb-4 md:pb-5 pt-0">
                        <div className="h-px bg-white/20 mb-4"></div>
                        <p className="text-white/95 text-sm md:text-base leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQSection
