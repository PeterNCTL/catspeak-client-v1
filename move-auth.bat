@echo off
mkdir "src\features\auth\components" 2>nul
mkdir "src\features\auth\hooks" 2>nul
mkdir "src\features\auth\context" 2>nul
mkdir "src\features\auth\api" 2>nul

xcopy /E /I /Y "src\components\Auth\*" "src\features\auth\components\"
copy /Y "src\hooks\useAuth.js" "src\features\auth\hooks\"
copy /Y "src\context\AuthModalContext.jsx" "src\features\auth\context\"
copy /Y "src\store\api\authApi.js" "src\features\auth\api\"

echo Auth files moved successfully!
