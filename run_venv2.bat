@echo off
call "c:\Users\sachi\OneDrive\Desktop\career-setu\CAREER-SETU---AI\CAREER SETU\.venv2\Scripts\activate.bat"
cd "c:\Users\sachi\OneDrive\Desktop\career-setu\CAREER-SETU---AI\CAREER SETU\backend"
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
