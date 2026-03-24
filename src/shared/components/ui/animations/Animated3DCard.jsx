import React from "react"

/**
 * A reusable 3D animated card container component based on Uiverse 3D UI.
 * Applies a perspective wrapper and a 3D rotation on hover to the card body.
 */
const Animated3DCard = ({
  children,
  className = "",
  containerClassName = "",
  onClick,
  style,
  ...props
}) => {
  const [hoverStyle, setHoverStyle] = React.useState({ transform: "rotateX(0deg) rotateY(0deg)" })

  const handleMouseEnter = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // Normalize position relative to center: -1 to 1
    const relX = (x / rect.width) * 2 - 1
    const relY = (y / rect.height) * 2 - 1
    
    // Tilt based on the entry point quadrant
    const rotateX = -relY * 10
    const rotateY = relX * 10
    
    setHoverStyle({ transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)` })
  }

  const handleMouseLeave = () => {
    setHoverStyle({ transform: "rotateX(0deg) rotateY(0deg)" })
  }

  return (
    <div
      className={`group [perspective:1000px] w-full ${
        onClick ? "cursor-pointer" : ""
      } ${containerClassName}`}
      onClick={onClick}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div
        className={`h-full w-full [transform-style:preserve-3d] transition-all duration-500 ease-in-out shadow-[rgba(0,0,0,0)_40px_50px_25px_-40px,rgba(0,0,0,0.2)_0px_25px_25px_-5px] group-hover:shadow-[rgba(0,0,0,0.3)_30px_50px_25px_-40px,rgba(0,0,0,0.1)_0px_25px_30px_0px] ${className}`}
        style={hoverStyle}
      >
        {children}
      </div>
    </div>
  )
}

export default Animated3DCard
