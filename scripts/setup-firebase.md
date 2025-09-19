# Firebase 项目设置指南

## 🔧 步骤 1: 启用 Firebase Authentication

1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 选择项目 "cigar-56871"
3. 在左侧菜单中点击 "Authentication"
4. 点击 "Get started" 或 "开始使用"
5. 在 "Sign-in method" 标签页中：
   - 点击 "Email/Password"
   - 启用 "Email/Password" 认证方式
   - 点击 "Save"

## 🗄️ 步骤 2: 启用 Firestore Database

1. 在 Firebase Console 左侧菜单中点击 "Firestore Database"
2. 点击 "Create database"
3. 选择 "Start in test mode" (测试模式)
4. 选择数据库位置（建议选择 asia-southeast1 或 us-central1）
5. 点击 "Done"

## 📋 步骤 3: 部署安全规则

### 选项 A: 使用 Firebase CLI（推荐）

```bash
# 安装 Firebase CLI
npm install -g firebase-tools

# 登录 Firebase
firebase login

# 初始化项目（如果还没有 firebase.json）
firebase init firestore

# 部署开放规则（用于开发测试）
firebase deploy --only firestore:rules --project cigar-56871
```

### 选项 B: 手动部署

1. 在 Firestore Database 页面中点击 "Rules" 标签
2. 复制 `firestore-open.rules` 文件的内容
3. 粘贴到规则编辑器中
4. 点击 "Publish"

## 👥 步骤 4: 创建测试用户

### 方法 1: 通过 Firebase Console

1. 在 Authentication 页面点击 "Users" 标签
2. 点击 "Add user"
3. 创建以下测试用户：

**管理员用户:**
- Email: `admin@jepcigar.com`
- Password: `admin123`

**经理用户:**
- Email: `manager@jepcigar.com`
- Password: `manager123`

### 方法 2: 通过应用注册

1. 在应用中点击 "注册" 标签
2. 填写注册表单
3. 系统会自动创建用户

## 🔍 步骤 5: 验证设置

1. 刷新浏览器页面
2. 尝试使用测试账户登录
3. 检查 Firestore Database 中是否创建了用户数据

## 🚨 故障排除

### 如果仍然出现权限错误：

1. **检查 Firestore 是否已启用**
   - 确保 Firestore Database 已创建并处于活动状态

2. **检查 Authentication 是否已启用**
   - 确保 Email/Password 认证方式已启用

3. **检查安全规则**
   - 确保已部署开放规则或正确的安全规则

4. **清除浏览器缓存**
   - 清除 localStorage 中的认证数据
   - 刷新页面重新登录

### 如果遇到其他错误：

1. **检查 Firebase 项目配置**
   - 确认项目 ID 为 "cigar-56871"
   - 确认 API Key 正确

2. **检查网络连接**
   - 确保可以访问 Firebase 服务

3. **查看浏览器控制台**
   - 查看详细的错误信息

## 📞 需要帮助？

如果按照上述步骤仍然无法解决问题，请：

1. 截图错误信息
2. 提供 Firebase 控制台的设置截图
3. 描述具体的错误步骤
