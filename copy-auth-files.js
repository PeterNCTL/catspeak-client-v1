const fs = require("fs")
const path = require("path")

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src)
  const stats = exists && fs.statSync(src)
  const isDirectory = exists && stats.isDirectory()

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true })
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName),
      )
    })
  } else {
    fs.copyFileSync(src, dest)
  }
}

// Copy Auth components
copyRecursiveSync("src/components/Auth", "src/features/auth/components")

// Copy useAuth hook
if (!fs.existsSync("src/features/auth/hooks")) {
  fs.mkdirSync("src/features/auth/hooks", { recursive: true })
}
fs.copyFileSync("src/hooks/useAuth.js", "src/features/auth/hooks/useAuth.js")

// Copy AuthModalContext
if (!fs.existsSync("src/features/auth/context")) {
  fs.mkdirSync("src/features/auth/context", { recursive: true })
}
fs.copyFileSync(
  "src/context/AuthModalContext.jsx",
  "src/features/auth/context/AuthModalContext.jsx",
)

// Copy authApi
if (!fs.existsSync("src/features/auth/api")) {
  fs.mkdirSync("src/features/auth/api", { recursive: true })
}
fs.copyFileSync("src/store/api/authApi.js", "src/features/auth/api/authApi.js")

console.log("Auth files copied successfully!")
