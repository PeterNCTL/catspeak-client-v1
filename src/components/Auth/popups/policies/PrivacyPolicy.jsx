import { useLanguage } from "@/context/LanguageContext"

const PrivacyPolicy = () => {
  const { t } = useLanguage()
  const policy = t.policies.privacyPolicy

  return (
    <div className="space-y-4 text-gray-700">
      <p className="text-sm leading-relaxed">
        <strong>Cat Speak</strong> - {policy.intro}
      </p>

      {/* Section 1 */}
      <div>
        <h3 className="font-bold text-[#8f0d15] mb-2">
          {policy.section1.title}
        </h3>
        <p className="text-sm leading-relaxed mb-2">{policy.section1.intro}</p>
        <ul className="list-disc list-inside text-sm space-y-1 ml-2">
          {policy.section1.items.map((item, index) => (
            <li key={index}>
              <strong>{item.label}</strong> {item.text}
            </li>
          ))}
        </ul>
      </div>

      {/* Section 2 */}
      <div>
        <h3 className="font-bold text-[#8f0d15] mb-2">
          {policy.section2.title}
        </h3>
        <p className="text-sm leading-relaxed mb-2">{policy.section2.intro}</p>
        <ul className="list-disc list-inside text-sm space-y-1 ml-2">
          {policy.section2.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Section 3 */}
      <div>
        <h3 className="font-bold text-[#8f0d15] mb-2">
          {policy.section3.title}
        </h3>
        <p className="text-sm leading-relaxed mb-2">{policy.section3.intro}</p>
        <ul className="list-disc list-inside text-sm space-y-1 ml-2">
          {policy.section3.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Section 4 */}
      <div>
        <h3 className="font-bold text-[#8f0d15] mb-2">
          {policy.section4.title}
        </h3>
        <p className="text-sm leading-relaxed mb-2">{policy.section4.intro}</p>
        <ul className="list-disc list-inside text-sm space-y-1 ml-2">
          {policy.section4.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Section 5 */}
      <div>
        <h3 className="font-bold text-[#8f0d15] mb-2">
          {policy.section5.title}
        </h3>
        <p className="text-sm leading-relaxed mb-2">{policy.section5.intro}</p>
        <ul className="list-disc list-inside text-sm space-y-1 ml-2">
          {policy.section5.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Section 6 */}
      <div>
        <h3 className="font-bold text-[#8f0d15] mb-2">
          {policy.section6.title}
        </h3>
        <ul className="list-disc list-inside text-sm space-y-1 ml-2">
          {policy.section6.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Section 7 */}
      <div>
        <h3 className="font-bold text-[#8f0d15] mb-2">
          {policy.section7.title}
        </h3>
        <p className="text-sm leading-relaxed mb-2">{policy.section7.intro}</p>
        <ul className="list-disc list-inside text-sm space-y-1 ml-2">
          {policy.section7.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <p className="text-sm leading-relaxed mt-2">{policy.section7.note}</p>
      </div>

      {/* Section 8 */}
      <div>
        <h3 className="font-bold text-[#8f0d15] mb-2">
          {policy.section8.title}
        </h3>
        {policy.section8.paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className={`text-sm leading-relaxed ${index > 0 ? "mt-2" : ""}`}
          >
            {paragraph}
          </p>
        ))}
      </div>

      {/* Section 9 */}
      <div>
        <h3 className="font-bold text-[#8f0d15] mb-2">
          {policy.section9.title}
        </h3>
        <p className="text-sm leading-relaxed mb-2">{policy.section9.intro}</p>
        <ul className="list-none text-sm space-y-1 ml-2">
          <li>
            <strong>{policy.section9.contact.email}</strong>{" "}
            support@catspeak.com
          </li>
          <li>
            <strong>{policy.section9.contact.website}</strong> www.catspeak.com
          </li>
          <li>
            <strong>{policy.section9.contact.fanpage}</strong>{" "}
            facebook.com/catspeak
          </li>
          <li>
            <strong>{policy.section9.contact.hotline}</strong> 1900-xxxx
          </li>
        </ul>
      </div>
    </div>
  )
}

export default PrivacyPolicy
