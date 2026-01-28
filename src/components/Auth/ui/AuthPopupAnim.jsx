import { motion } from "framer-motion"

const AuthPopupAnim = ({ children, className, ...props }) => {
  // Fluent design motion curve
  const fluentEaseOut = [0.16, 1, 0.3, 1]

  // Animation variants
  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
    },
    enter: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: fluentEaseOut },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.3, ease: fluentEaseOut },
    },
  }

  return (
    <motion.div
      variants={modalVariants}
      initial="hidden"
      animate="enter"
      exit="exit"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default AuthPopupAnim
