@echo off
echo Starting Mobile Store Website...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if the project directories exist
if not exist "web-project-backend" (
    echo Error: web-project-backend directory not found
    echo Please make sure you're running this file from the correct location
    pause
    exit /b 1
)

if not exist "web-project-frontend" (
    echo Error: web-project-frontend directory not found
    echo Please make sure you're running this file from the correct location
    pause
    exit /b 1
)

echo Installing dependencies...
echo.

REM Install backend dependencies
echo Installing backend dependencies...
cd web-project-backend
if not exist "node_modules" (
    npm install
) else (
    echo Backend dependencies already installed
)

REM Install frontend dependencies
echo Installing frontend dependencies...
cd ..\web-project-frontend
if not exist "node_modules" (
    npm install
) else (
    echo Frontend dependencies already installed
)

cd ..

echo.
echo Starting servers...
echo.

REM Start backend server in a new window
echo Starting backend server...
start "Backend Server" cmd /k "cd web-project-backend && npm start"

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend server in a new window
echo Starting frontend server...
start "Frontend Server" cmd /k "cd web-project-frontend && npm start"

REM Wait for frontend to start and let it open the first tab
timeout /t 8 /nobreak >nul

REM Don't open a second tab - let React handle the browser opening
echo.
echo Website is starting up!
echo Backend: http://localhost:5000 (API server - no need to open in browser)
echo Frontend: http://localhost:3000 (Website - should be open in browser)
echo.
echo Both servers are running in separate windows.
echo Close those windows to stop the servers.
echo.
pause
