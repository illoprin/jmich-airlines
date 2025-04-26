@echo off
title Project Launcher

:: Start Redis server in a new window
start "Redis Server" /D "D:\Bin\redis" cmd /k "redis-server --port 9500"

:: Start backend in a new window
start "Backend" cmd /k "ts-node ./src/index.ts"

echo All project components are starting...
pause