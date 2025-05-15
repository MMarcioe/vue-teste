@echo off

rem primeira vez executar:
rem npm install -g npm-check-updates
rem npm install -g sass-migrator

echo npm i -g npm-check-updates
call npm i -g npm-check-updates

echo ncu upgrade
call ncu --upgrade

echo npm install
call npm install

rem call sass-migrator division node_modules/quasar/src/css/**/*.sass

echo npm audit fix
call npm audit fix
pause