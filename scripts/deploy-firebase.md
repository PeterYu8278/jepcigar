# Firebase 部署指南

## 🚀 快速部署步骤

### 1. 安装 Firebase CLI

```bash
# 使用 npm 安装 Firebase CLI
npm install -g firebase-tools

# 或者使用 yarn
yarn global add firebase-tools
```

### 2. 登录 Firebase

```bash
firebase login
```

### 3. 初始化项目（如果还没有 firebase.json）

```bash
firebase init
```

选择以下服务：
- ✅ Firestore: Configure security rules and indexes files
- ✅ Hosting: Configure files for Firebase Hosting

### 4. 部署安全规则

```bash
# 部署生产级安全规则
firebase deploy --only firestore:rules --project cigar-56871

# 或者部署开放规则（仅用于开发测试）
firebase deploy --only firestore:rules:firestore-open.rules --project cigar-56871
```

### 5. 部署索引

```bash
firebase deploy --only firestore:indexes --project cigar-56871
```

### 6. 部署整个项目

```bash
firebase deploy --project cigar-56871
```

## 🔧 手动部署方法

如果您不想使用 CLI，可以手动部署：

### Firestore 安全规则

1. 访问 [Firebase Console](https://console.firebase.google.com/)
2. 选择项目 "cigar-56871"
3. 点击左侧 "Firestore Database"
4. 点击 "Rules" 标签
5. 复制 `firestore.rules` 或 `firestore-open.rules` 的内容
6. 粘贴到规则编辑器中
7. 点击 "Publish"

### Firestore 索引

1. 在 Firestore Database 页面
2. 点击 "Indexes" 标签
3. 点击 "Create Index"
4. 根据 `firestore.indexes.json` 中的配置创建索引

## 🎯 推荐的部署顺序

1. **开发阶段**：部署开放规则进行测试
2. **测试完成**：部署生产级安全规则
3. **创建索引**：提高查询性能
4. **部署应用**：部署到 Firebase Hosting

## 📋 验证部署

部署完成后，检查：

1. **安全规则**：
   ```bash
   # 测试读取权限
   firebase firestore:get /users/test-user
   ```

2. **索引**：
   - 在 Firebase Console 中查看索引状态
   - 确保所有索引都显示为 "Enabled"

3. **应用部署**：
   - 访问部署的 URL
   - 测试用户注册和登录功能

## 🚨 故障排除

### 如果部署失败：

1. **检查项目 ID**：
   ```bash
   firebase projects:list
   ```

2. **检查权限**：
   ```bash
   firebase login --reauth
   ```

3. **检查规则语法**：
   ```bash
   firebase firestore:rules:test firestore.rules
   ```

### 如果规则不生效：

1. 等待几分钟让规则生效
2. 清除浏览器缓存
3. 检查控制台错误信息
4. 验证用户认证状态
