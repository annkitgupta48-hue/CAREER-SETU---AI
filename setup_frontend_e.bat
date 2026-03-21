@echo off
title Frontend Server Setup
echo Navigating to E: drive frontend...
E:
cd \CAREER-SETU\frontend

echo Installing frontend dependencies (this may take a minute)...
call npm install

echo Starting Next.js Frontend...
call npm run dev
