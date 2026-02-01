import React, { useEffect, useState } from "react"
import {
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom"
import {
  Menu,
  MenuItem,
  Fade,
  ListItemIcon,
  Stack,
  Typography,
  Chip,
} from "@mui/material"
import { FiChevronDown } from "react-icons/fi"
import { VietNam, China, USA } from "@assets/icons/flags"
import { useLanguage } from "../../../context/LanguageContext"

export const navLinks = [
  { key: "community", href: "/community", hasDropdown: true },
  { key: "catSpeak", href: "/cat-speak" },
  { key: "cart", href: "/cart" },
  { key: "connect", href: "/connect" },
]

const HeaderNav = () => {
  const { t } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  // Dropdown state
  const [anchorEl, setAnchorEl] = useState(null)
  const isDropdownOpen = Boolean(anchorEl)

  // Selected label state
  const [selectedLabel, setSelectedLabel] = useState(null)

  // Sync state with URL params on mount/update
  useEffect(() => {
    const lang = searchParams.get("language")
    if (location.pathname === "/community") {
      if (lang === "chinese") setSelectedLabel("Trung Quốc")
      else if (lang === "english") setSelectedLabel("Anh")
      else setSelectedLabel(null) // Default to "Community"
    } else {
      setSelectedLabel(null)
    }
  }, [location.pathname, searchParams])

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLanguageSelect = (label, path) => {
    setSelectedLabel(label)
    handleMenuClose()
    if (path) navigate(path)
  }

  const renderNavItem = ({ key, href, hasDropdown, noActive }) => {
    const isActive = location.pathname.startsWith(href)

    // For items with noActive flag, never show active state
    const baseClassName = [
      "flex flex-1 whitespace-nowrap items-center justify-center py-3 px-12 gap-2 text-sm font-semibold uppercase tracking-wide rounded-full transition-all duration-200 hover:text-white",
      noActive
        ? "text-white/80 hover:text-white hover:bg-white/10 hover:shadow-[inset_-1px_-1px_3px_rgba(255,255,255,0.3),inset_1px_1px_3px_rgba(0,0,0,0.2)]" // Always normal style
        : isActive
          ? "text-white bg-white/20 shadow-[inset_-2px_-2px_4px_rgba(255,255,255,0.3),inset_2px_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[inset_-1px_-1px_3px_rgba(255,255,255,0.3),inset_1px_1px_3px_rgba(0,0,0,0.2)]"
          : "text-white/80 hover:text-white hover:bg-white/10 hover:shadow-[inset_-1px_-1px_3px_rgba(255,255,255,0.3),inset_1px_1px_3px_rgba(0,0,0,0.2)]",
    ].join(" ")

    if (hasDropdown && key === "community") {
      const dropdownClassName = [
        "flex flex-1 whitespace-nowrap items-center justify-center py-3 px-12 gap-2 text-sm font-semibold uppercase tracking-wide rounded-full transition-all duration-200 hover:text-white cursor-pointer select-none",
        isDropdownOpen || isActive
          ? "text-white bg-white/20 shadow-[inset_-2px_-2px_4px_rgba(255,255,255,0.3),inset_2px_2px_4px_rgba(0,0,0,0.2)] hover:shadow-[inset_-1px_-1px_3px_rgba(255,255,255,0.3),inset_1px_1px_3px_rgba(0,0,0,0.2)]"
          : "text-white/80 hover:text-white hover:bg-white/10 hover:shadow-[inset_-1px_-1px_3px_rgba(255,255,255,0.3),inset_1px_1px_3px_rgba(0,0,0,0.2)]",
      ].join(" ")

      return (
        <React.Fragment key={key}>
          <button
            className={dropdownClassName}
            onClick={handleMenuOpen}
            aria-controls={isDropdownOpen ? "community-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={isDropdownOpen ? "true" : undefined}
          >
            {selectedLabel || t.nav[key]}
            <FiChevronDown
              className={`w-4 h-4 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
          <Menu
            id="community-menu"
            anchorEl={anchorEl}
            open={isDropdownOpen}
            onClose={handleMenuClose} // Click outside closes immediately
            TransitionComponent={Fade}
            MenuListProps={{
              "aria-labelledby": "basic-button",
              sx: { py: 1, minWidth: 200 },
            }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            slotProps={{
              paper: {
                elevation: 3,
                sx: {
                  mt: 1,
                  borderRadius: 2,
                  overflow: "visible",
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: "50%",
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translate(50%, -50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              },
            }}
          >
            {/* Vietnam - Disabled */}
            <MenuItem
              disabled
              onClick={(e) => e.preventDefault()}
              sx={{ height: 40, opacity: 1 }}
            >
              <ListItemIcon>
                <img
                  src={VietNam}
                  alt="Vietnam"
                  className="w-6 h-6 rounded-full object-cover grayscale opacity-50"
                  style={{ width: 24, height: 24 }} // Ensure exact size matching icon
                />
              </ListItemIcon>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                width="100%"
              >
                <Typography variant="body2" color="text.secondary">
                  Việt Nam
                </Typography>
                <Chip
                  label="Soon"
                  size="small"
                  sx={{
                    ml: 1,
                    height: 20,
                    fontSize: "0.65rem",
                    fontWeight: "bold",
                    opacity: 0.7,
                  }}
                />
              </Stack>
            </MenuItem>

            {/* China */}
            <MenuItem
              onClick={() =>
                handleLanguageSelect(
                  "Trung Quốc",
                  "/community?language=chinese",
                )
              }
              sx={{ height: 40 }}
            >
              <ListItemIcon>
                <img
                  src={China}
                  alt="China"
                  className="w-6 h-6 rounded-full object-cover"
                  style={{ width: 24, height: 24 }}
                />
              </ListItemIcon>
              <Typography variant="body2">Trung Quốc</Typography>
            </MenuItem>

            {/* USA */}
            <MenuItem
              onClick={() =>
                handleLanguageSelect("Anh", "/community?language=english")
              }
              sx={{ height: 40 }}
            >
              <ListItemIcon>
                <img
                  src={USA}
                  alt="English"
                  className="w-6 h-6 rounded-full object-cover"
                  style={{ width: 24, height: 24 }}
                />
              </ListItemIcon>
              <Typography variant="body2">Anh</Typography>
            </MenuItem>
          </Menu>
        </React.Fragment>
      )
    }

    return (
      <NavLink key={key} to={href} className={baseClassName}>
        {t.nav[key]}
      </NavLink>
    )
  }

  return (
    <nav className="hidden items-center justify-between rounded-full bg-[linear-gradient(180deg,#FAC126_0%,#990011_100%)] p-1 gap-1 text-white shadow-[0_4px_12px_rgba(194,19,26,0.2)] lg:flex">
      {navLinks.map(renderNavItem)}
    </nav>
  )
}

export default HeaderNav
