@echo off
set "PYTHON_EXE=c:\Users\sachi\OneDrive\Desktop\career-setu\CAREER-SETU---AI\CAREER SETU\.venv\Scripts\python.exe"
set "BACKEND_DIR=c:\Users\sachi\OneDrive\Desktop\career-setu\CAREER-SETU---AI\CAREER SETU\backend"
set "LOG_FILE=c:\Users\sachi\OneDrive\Desktop\career-setu\CAREER-SETU---AI\CAREER SETU\backend_bat.log"

echo Starting Backend... > "%LOG_FILE%"
cd /d "%BACKEND_DIR%"
"%PYTHON_EXE%" -m uvicorn app.main:app --host 0.0.0.0 --port 8000 >> "%LOG_FILE%" 2>&1
echo Done. >> "%LOG_FILE%"
