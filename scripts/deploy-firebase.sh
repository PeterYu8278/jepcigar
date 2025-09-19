#!/bin/bash

# Firebase 部署脚本
# 用于自动部署 Firestore 规则和索引

echo "🚀 开始 Firebase 部署..."

# 检查是否安装了 Firebase CLI
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI 未安装"
    echo "请运行: npm install -g firebase-tools"
    exit 1
fi

# 检查是否已登录
if ! firebase projects:list &> /dev/null; then
    echo "❌ 未登录 Firebase"
    echo "请运行: firebase login"
    exit 1
fi

echo "✅ Firebase CLI 已就绪"

# 部署 Firestore 安全规则
echo "📋 部署 Firestore 安全规则..."
if [ "$1" = "open" ]; then
    echo "⚠️  使用开放规则（仅用于开发测试）"
    firebase deploy --only firestore:rules --project cigar-56871
else
    echo "🔒 使用生产级安全规则"
    firebase deploy --only firestore:rules --project cigar-56871
fi

if [ $? -eq 0 ]; then
    echo "✅ Firestore 安全规则部署成功"
else
    echo "❌ Firestore 安全规则部署失败"
    exit 1
fi

# 部署 Firestore 索引
echo "📊 部署 Firestore 索引..."
firebase deploy --only firestore:indexes --project cigar-56871

if [ $? -eq 0 ]; then
    echo "✅ Firestore 索引部署成功"
else
    echo "❌ Firestore 索引部署失败"
    exit 1
fi

# 部署应用（可选）
if [ "$2" = "app" ]; then
    echo "🌐 部署应用到 Firebase Hosting..."
    firebase deploy --only hosting --project cigar-56871
    
    if [ $? -eq 0 ]; then
        echo "✅ 应用部署成功"
    else
        echo "❌ 应用部署失败"
        exit 1
    fi
fi

echo "🎉 Firebase 部署完成！"
echo ""
echo "📋 下一步："
echo "1. 在 Firebase Console 中验证规则和索引"
echo "2. 测试用户注册和登录功能"
echo "3. 检查 Firestore 数据是否正确存储"
