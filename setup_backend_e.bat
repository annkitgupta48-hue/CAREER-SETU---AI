@echo off
title Backend Server Setup
echo Navigating to E: drive project...
E:
cd \CAREER-SETU\backend

echo Fixing virtual environment...
if exist ".venv" rmdir /s /q .venv
python -m venv .venv
call .venv\Scripts\activate.bat

echo Installing backend requirements...
pip install -r requirements.txt

echo Installing AI models...
python -m spacy download en_core_web_sm

echo Starting FastAPI Backend...
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
