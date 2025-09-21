# 🔧 环境变量配置指南

## 📋 概述

JEP Cigar Business System 使用环境变量来配置各种功能。由于Firebase配置已经在代码中硬编码，大部分环境变量是可选的。

## 🚀 快速设置

### 1. 创建 .env 文件

在项目根目录创建 `.env` 文件：

```bash
# 在项目根目录运行
touch .env
```

### 2. 添加环境变量

将以下内容添加到 `.env` 文件中：

```env
# JEP Cigar Business System - Environment Variables

# Firebase Configuration (可选 - 配置已在firebase.ts中硬编码)
# 如果需要覆盖默认配置，可以取消注释并填入实际值
# VITE_FIREBASE_API_KEY=your_firebase_api_key_here
# VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
# VITE_FIREBASE_PROJECT_ID=your_project_id_here

# Application Configuration
VITE_APP_BASE_URL=http://localhost:3000
VITE_APP_API_URL=http://localhost:3000/api

# Development Settings
VITE_DEV_MODE=true
VITE_DEBUG_LOGS=false

# Performance Settings
VITE_PERFORMANCE_MONITORING=true
VITE_LONG_TASK_THRESHOLD=100

# Feature Flags
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_OFFLINE_MODE=true
```

## 🔧 环境变量说明

### Firebase 配置 (可选)

由于Firebase配置已经在 `src/config/firebase.ts` 中硬编码，这些环境变量是可选的：

- `VITE_FIREBASE_API_KEY`: Firebase API密钥
- `VITE_FIREBASE_AUTH_DOMAIN`: Firebase认证域名
- `VITE_FIREBASE_PROJECT_ID`: Firebase项目ID
- `VITE_FIREBASE_STORAGE_BUCKET`: Firebase存储桶
- `VITE_FIREBASE_MESSAGING_SENDER_ID`: Firebase消息发送者ID
- `VITE_FIREBASE_APP_ID`: Firebase应用ID

### 应用配置

- `VITE_APP_BASE_URL`: 应用基础URL
- `VITE_APP_API_URL`: API基础URL

### 开发设置

- `VITE_DEV_MODE`: 开发模式开关
- `VITE_DEBUG_LOGS`: 调试日志开关

### 性能设置

- `VITE_PERFORMANCE_MONITORING`: 性能监控开关
- `VITE_LONG_TASK_THRESHOLD`: 长任务阈值(毫秒)

### 功能标志

- `VITE_ENABLE_PWA`: PWA功能开关
- `VITE_ENABLE_ANALYTICS`: 分析功能开关
- `VITE_ENABLE_OFFLINE_MODE`: 离线模式开关

## 🚨 故障排除

### 环境变量验证错误

如果看到以下错误：

```
Environment validation failed: ['VITE_FIREBASE_API_KEY is required', ...]
```

**解决方案**：
1. 创建 `.env` 文件（如上所示）
2. 或者忽略这些错误，因为Firebase配置已经硬编码

### 控制台日志过多

如果开发环境控制台日志过多：

1. 设置 `VITE_DEBUG_LOGS=false`
2. 重启开发服务器
3. 日志输出将被优化

### 性能警告

如果看到性能警告：

```
[PerformanceOptimizer] 检测到长任务: XXXms
```

**解决方案**：
1. 这是正常的性能监控
2. 可以通过 `VITE_LONG_TASK_THRESHOLD` 调整阈值
3. 设置 `VITE_PERFORMANCE_MONITORING=false` 禁用监控

## 📝 注意事项

1. **安全性**: 不要将 `.env` 文件提交到版本控制系统
2. **默认值**: 大部分配置都有合理的默认值
3. **Firebase**: 当前配置使用硬编码的Firebase设置，无需额外配置
4. **开发环境**: 大部分日志只在开发环境显示

## 🔄 更新配置

修改 `.env` 文件后：

1. 重启开发服务器：`npm run dev`
2. 清除浏览器缓存
3. 检查控制台是否还有错误

---

🎉 **完成！** 现在您的环境变量配置已完成，应用应该可以正常运行而不会显示环境验证错误。
