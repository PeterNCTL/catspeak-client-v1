import workshop1 from "@/shared/assets/images/workshops/workshop1.jpg"

/**
 * Utility to get the workshop slides data.
 * @param {Object} t - Translation object from i18n context
 * @param {Array} propSlides - Additional slides passed as props
 * @returns {Array} Combined slides array
 */
export const getWorkshopSlides = (t, propSlides = []) => [
  {
    title: t.workshops.chinaWorkshop.title,
    subtext: `${t.workshops.chinaWorkshop.introText} ${t.workshops.chinaWorkshop.introHighlight} ${t.workshops.chinaWorkshop.introClosing}`,
    cta: t.workshops.chinaWorkshop.cta,
    image: workshop1,
    modal: "china",
  },
  ...propSlides,
]
