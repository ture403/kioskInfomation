@echo off
echo ===================================================
echo   [1/2] Starting Frontend (React/Vite) Build...
echo ===================================================
cd src\main\front
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Frontend build failed.
    cd ..\..\..
    pause
    exit /b %errorlevel%
)
cd ..\..\..

echo.
echo ===================================================
echo   [2/2] Starting Backend (Spring Boot) Build...
echo ===================================================
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot
echo Current JAVA_HOME: %JAVA_HOME%
call gradlew build -x test
if %errorlevel% neq 0 (
    echo [ERROR] Backend build failed.
    pause
    exit /b %errorlevel%
)

echo.
echo ===================================================
echo   [SUCCESS] All builds completed successfully!
echo   Output File: build\libs\premier-0.0.1-SNAPSHOT.jar
echo ===================================================
pause
