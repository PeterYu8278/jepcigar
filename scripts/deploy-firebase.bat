@echo off
REM Firebase 部署脚本 (Windows)
REM 用于自动部署 Firestore 规则和索引

echo 🚀 开始 Firebase 部署...

REM 检查是否安装了 Firebase CLI
firebase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Firebase CLI 未安装
    echo 请运行: npm install -g firebase-tools
    pause
    exit /b 1
)

REM 检查是否已登录
firebase projects:list >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未登录 Firebase
    echo 请运行: firebase login
    pause
    exit /b 1
)

echo ✅ Firebase CLI 已就绪

REM 部署 Firestore 安全规则
echo 📋 部署 Firestore 安全规则...
if "%1"=="open" (
    echo ⚠️  使用开放规则（仅用于开发测试）
    firebase deploy --only firestore:rules --project cigar-56871
) else (
    echo 🔒 使用生产级安全规则
    firebase deploy --only firestore:rules --project cigar-56871
)

if %errorlevel% neq 0 (
    echo ❌ Firestore 安全规则部署失败
    pause
    exit /b 1
)

echo ✅ Firestore 安全规则部署成功

REM 部署 Firestore 索引
echo 📊 部署 Firestore 索引...
firebase deploy --only firestore:indexes --project cigar-56871

if %errorlevel% neq 0 (
    echo ❌ Firestore 索引部署失败
    pause
    exit /b 1
)

echo ✅ Firestore 索引部署成功

REM 部署应用（可选）
if "%2"=="app" (
    echo 🌐 部署应用到 Firebase Hosting...
    firebase deploy --only hosting --project cigar-56871
    
    if %errorlevel% neq 0 (
        echo ❌ 应用部署失败
        pause
        exit /b 1
    )
    
    echo ✅ 应用部署成功
)

echo 🎉 Firebase 部署完成！
echo.
echo 📋 下一步：
echo 1. 在 Firebase Console 中验证规则和索引
echo 2. 测试用户注册和登录功能
echo 3. 检查 Firestore 数据是否正确存储
pause
