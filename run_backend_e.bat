@echo off
E:
cd \CAREER-SETU\backend
set TEMP=E:\temp
set TMP=E:\temp
python -m venv .venv_e
call .venv_e\Scripts\activate.bat
pip install --no-cache-dir -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
