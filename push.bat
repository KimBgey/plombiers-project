@echo off
chcp 65001 >nul
title Plombiers Pro — Git Push

echo.
echo  Plombiers Pro — Git Push automatique
echo ----------------------------------------
echo.

:: Vérifier qu'on est dans un repo git
if not exist ".git" (
    echo  ERREUR : Ce dossier n'est pas un repo Git.
    echo  Place ce fichier a la racine du projet.
    pause
    exit /b 1
)

:: Afficher les fichiers modifiés
echo  Fichiers modifies :
echo.
git status --short
echo.

:: Demander le message de commit
set /p MSG=" Message de commit (Entree = auto) : "

:: Message automatique si vide
if "%MSG%"=="" (
    for /f "tokens=1-2 delims= " %%a in ('date /t') do set DATE=%%b
    for /f "tokens=1 delims= " %%a in ('time /t') do set TIME=%%a
    set MSG=update: %DATE% %TIME%
)

echo.
echo  Message : "%MSG%"
echo.
set /p CONFIRM=" Continuer ? (o/n) : "

if /i not "%CONFIRM%"=="o" (
    echo  Annule.
    pause
    exit /b 0
)

echo.
echo  [1/3] git add ...
git add .

echo  [2/3] git commit ...
git commit -m "%MSG%"

if errorlevel 1 (
    echo.
    echo  ERREUR : Rien a committer ou probleme.
    pause
    exit /b 1
)

echo  [3/3] git push ...
git push

if errorlevel 1 (
    echo.
    echo  ERREUR : Push echoue. Verifie ta connexion ou tes credentials.
    pause
    exit /b 1
)

echo.
echo  Push reussi !
echo.
pause