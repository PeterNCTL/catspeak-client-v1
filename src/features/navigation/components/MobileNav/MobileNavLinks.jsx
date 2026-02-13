import React from "react"
import { List } from "@mui/material"
import { navLinks } from "../../config/navigation"
import MobileCommunityDropdown from "./MobileCommunityDropdown"
import MobileNavItem from "./MobileNavItem"

const MobileNavLinks = ({ onClose }) => {
  return (
    <List component="div" disablePadding>
      {navLinks.map(({ key, hasDropdown }) => {
        if (hasDropdown && key === "community") {
          return (
            <MobileCommunityDropdown key={key} navKey={key} onClose={onClose} />
          )
        }
        return <MobileNavItem key={key} navKey={key} onClose={onClose} />
      })}
    </List>
  )
}

export default MobileNavLinks
