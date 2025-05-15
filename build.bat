@echo off
echo VITE_VERSAO=%Date:~0,10% > .env
call npm run build
pause