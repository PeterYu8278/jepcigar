# 🔥 Firebase 完整设置指南

## 📋 概述

本指南将帮助您完成 Firebase 的完整配置，包括：
- ✅ Firestore 数据库设置
- ✅ Authentication 配置
- ✅ 安全规则部署
- ✅ 测试用户创建
- ✅ 应用部署

## 🚀 快速开始

### 1. 安装 Firebase CLI

```bash
# 安装 Firebase CLI
npm install -g firebase-tools

# 验证安装
firebase --version
```

### 2. 登录 Firebase

```bash
firebase login
```

### 3. 启用 Firebase 服务

访问 [Firebase Console](https://console.firebase.google.com/) 并选择项目 "cigar-56871"：

#### 🔐 启用 Authentication
1. 点击左侧 "Authentication"
2. 点击 "Get started"
3. 在 "Sign-in method" 标签页中启用 "Email/Password"

#### 🗄️ 启用 Firestore Database
1. 点击左侧 "Firestore Database"
2. 点击 "Create database"
3. 选择 "Start in test mode"
4. 选择数据库位置（建议：asia-southeast1）

### 4. 部署安全规则

#### 方法 A: 使用 npm 脚本（推荐）

```bash
# 部署生产级安全规则
npm run firebase:deploy:rules

# 部署索引
npm run firebase:deploy:indexes
```

#### 方法 B: 使用部署脚本

```bash
# Windows
scripts\deploy-firebase.bat

# Linux/Mac
chmod +x scripts/deploy-firebase.sh
./scripts/deploy-firebase.sh
```

#### 方法 C: 手动部署

1. 在 Firebase Console 中点击 "Firestore Database"
2. 点击 "Rules" 标签
3. 复制 `firestore.rules` 内容并粘贴
4. 点击 "Publish"

### 5. 创建测试用户

#### 自动创建（推荐）

1. 启动开发服务器：`npm run dev`
2. 打开浏览器控制台
3. 运行：`window.createTestUsers()`

#### 手动创建

在 Firebase Console 的 Authentication 页面：
1. 点击 "Add user"
2. 创建以下测试账户：

| 邮箱 | 密码 | 角色 | 权限 |
|------|------|------|------|
| admin@jepcigar.com | admin123 | admin | 全部权限 |
| manager@jepcigar.com | manager123 | manager | 读写管理 |
| staff@jepcigar.com | staff123 | staff | 只读 |

### 6. 验证设置

1. 刷新浏览器页面
2. 查看控制台的 Firebase 配置状态
3. 尝试登录测试账户
4. 检查 Firestore 中的数据

## 📁 文件结构

```
├── firebase.json              # Firebase 项目配置
├── firestore.rules            # 生产级安全规则
├── firestore-open.rules       # 开发测试规则
├── firestore.indexes.json     # Firestore 索引配置
├── scripts/
│   ├── deploy-firebase.sh     # Linux/Mac 部署脚本
│   ├── deploy-firebase.bat    # Windows 部署脚本
│   ├── setup-firebase.md      # 详细设置指南
│   └── deploy-firebase.md     # 部署指南
└── src/utils/
    ├── firebaseCheck.ts       # Firebase 配置检查
    └── createTestUsers.ts     # 测试用户创建
```

## 🔧 开发工作流

### 日常开发

1. **启动开发服务器**：
   ```bash
   npm run dev
   ```

2. **检查 Firebase 状态**：
   - 查看浏览器控制台的配置状态
   - 确保所有服务都显示 "✅ Working"

3. **创建测试用户**（如果需要）：
   ```bash
   # 在浏览器控制台运行
   window.createTestUsers()
   ```

### 部署到生产

1. **构建应用**：
   ```bash
   npm run build
   ```

2. **部署 Firebase 规则**：
   ```bash
   npm run firebase:deploy:rules
   npm run firebase:deploy:indexes
   ```

3. **部署应用**：
   ```bash
   npm run firebase:deploy:hosting
   ```

## 🚨 故障排除

### 常见问题

#### 1. Firestore 权限错误
```
Error: Missing or insufficient permissions
```

**解决方案**：
- 确保已部署安全规则
- 检查用户是否已认证
- 验证安全规则语法

#### 2. Authentication 400 错误
```
POST .../accounts:signInWithPassword 400 (Bad Request)
```

**解决方案**：
- 确保 Authentication 已启用
- 检查 Email/Password 认证方式已开启
- 验证测试用户是否存在

#### 3. 用户创建失败
```
Error: User creation failed
```

**解决方案**：
- 检查 Firestore 是否已启用
- 验证安全规则允许写入
- 查看详细错误信息

### 调试工具

1. **Firebase 配置检查**：
   ```javascript
   // 在浏览器控制台运行
   import { checkFirebaseConfiguration } from './src/utils/firebaseCheck.js';
   checkFirebaseConfiguration().then(console.log);
   ```

2. **测试用户验证**：
   ```javascript
   // 在浏览器控制台运行
   window.createTestUsers()
   ```

3. **Firebase Console**：
   - 查看 Authentication 用户列表
   - 检查 Firestore 数据
   - 监控安全规则执行

## 📊 监控和维护

### 定期检查

1. **Firebase 使用量**：
   - 查看 Firebase Console 的使用统计
   - 监控 Firestore 读写次数
   - 检查 Authentication 使用情况

2. **安全规则**：
   - 定期审查安全规则
   - 测试权限边界
   - 更新规则以适应新功能

3. **用户数据**：
   - 检查用户注册趋势
   - 监控异常登录活动
   - 清理测试数据

### 备份策略

1. **Firestore 数据**：
   - 使用 Firebase CLI 导出数据
   - 定期备份用户数据
   - 测试数据恢复流程

2. **安全规则**：
   - 版本控制所有规则文件
   - 保留规则变更历史
   - 文档化规则变更原因

## 🎯 下一步

完成 Firebase 设置后，您可以：

1. **扩展业务数据**：
   - 实现雪茄库存管理
   - 添加客户数据存储
   - 创建订单管理系统

2. **增强安全性**：
   - 实施角色基础访问控制
   - 添加数据验证规则
   - 设置审计日志

3. **优化性能**：
   - 添加更多 Firestore 索引
   - 实施数据缓存策略
   - 监控查询性能

## 📞 支持

如果遇到问题：

1. 查看浏览器控制台的详细错误信息
2. 检查 Firebase Console 的服务状态
3. 参考 Firebase 官方文档
4. 查看项目中的故障排除指南

---

🎉 **恭喜！** 您已完成 Firebase 的完整配置。现在可以开始使用 JEP 雪茄管理系统了！
