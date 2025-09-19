# JEP Cigar Business System

一个为雪茄企业家打造的高端数字工具系统，提供完整的业务管理解决方案。

## 🚀 功能特性

### 📦 库存管理
- 雪茄品牌、产地、年份管理
- 价格历史和库存交易记录
- 包装类型（盒装、管装、散装）
- 库存警报和自动补货提醒

### 👥 客户关系管理 (CRM)
- 客户偏好记录和数字名片
- 推荐关系追踪
- 客户分层管理
- 个性化服务记录

### 🎯 推荐系统
- 个性化推荐链接生成
- 推荐奖励积分系统
- 转换率追踪和分析
- 推荐关系链管理

### 🎮 游戏化功能
- 幸运转盘抽奖系统
- 会员等级体系（Silver/Gold/Platinum/Royal）
- 积分奖励和兑换机制
- 徽章和成就系统

### 🎁 礼品定制模块
- 个性化包装和贺卡
- 智能礼品推荐
- 配送跟踪管理
- 节日和场合定制

### 📅 活动管理
- RSVP在线报名系统
- 二维码签到/签退
- 网络连接追踪
- 活动参与度分析

### 🏪 积分商城
- 积分赚取和消费记录
- 配件和体验兑换
- 转盘机会购买
- 积分有效期管理

### 🎓 雪茄学院
- 在线学习课程
- 徽章和证书系统
- 学习进度追踪
- 知识库管理

### 🤖 AI推荐引擎
- 基于历史的智能推荐
- 商务vs个人需求区分
- 推荐准确率分析
- 持续学习优化

### 📊 财务分析
- 销售数据可视化
- 发票自动生成
- 财务报表导出
- 客户消费分析

## 🛠️ 技术栈

- **前端**: React 18 + TypeScript + Vite
- **UI库**: Ant Design 5.x (中文国际化)
- **状态管理**: Zustand + React Query
- **路由**: React Router v6
- **后端**: Firebase (Auth + Firestore)
- **部署**: Netlify
- **构建工具**: Vite + TypeScript
- **样式**: Tailwind CSS

## 📁 项目结构

```
src/
├── components/          # 通用组件
│   ├── Layout/         # 布局组件
│   ├── Auth/           # 认证组件
│   └── ...
├── pages/              # 页面组件
│   ├── Dashboard/      # 仪表板
│   ├── Inventory/      # 库存管理
│   ├── Customer/       # 客户管理
│   ├── Event/          # 活动管理
│   ├── Gamification/   # 游戏化功能
│   ├── Gifting/        # 礼品定制
│   ├── Academy/        # 雪茄学院
│   ├── Analytics/      # 分析报告
│   └── ...
├── stores/             # 状态管理
│   ├── authStore.ts    # 认证状态
│   ├── inventoryStore.ts # 库存状态
│   ├── customerStore.ts  # 客户状态
│   └── ...
├── services/           # 服务层
│   ├── firebaseService.ts # Firebase服务
│   └── ...
├── types/              # TypeScript类型定义
├── config/             # 配置文件
├── utils/              # 工具函数
└── assets/             # 静态资源
```

## 🚀 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖
```bash
npm install
```

### 环境配置
1. 复制 `.env.example` 为 `.env.local`
2. 配置Firebase项目信息
3. 更新Firebase配置

### 开发服务器
```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本
```bash
npm run build
```

### 预览生产版本
```bash
npm run preview
```

## 🔧 开发指南

### 代码规范
- 使用TypeScript进行类型检查
- 遵循ESLint和Prettier配置
- 组件使用函数式组件和Hooks
- 状态管理使用Zustand

### 提交规范
```bash
# 功能开发
git commit -m "feat: 添加库存管理功能"

# 问题修复
git commit -m "fix: 修复客户搜索问题"

# 文档更新
git commit -m "docs: 更新README文档"
```

### 测试
```bash
# 运行测试
npm run test

# 测试覆盖率
npm run test:coverage
```

## 📱 部署

### Netlify部署
1. 连接GitHub仓库到Netlify
2. 配置构建命令: `npm run build`
3. 配置发布目录: `dist`
4. 设置环境变量

### 环境变量
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 🔐 Firebase配置

### Firestore数据库
系统现在使用Firestore作为主要数据存储，包括：

#### 用户数据存储
- **Firebase Authentication**: 基础认证信息（邮箱、密码）
- **Firestore `users` 集合**: 扩展用户信息（角色、权限、个人资料）
- **Firestore `userProfiles` 集合**: 详细用户配置文件

#### 数据集合结构
```
users/
├── {userId}/
│   ├── firebaseUid: string
│   ├── email: string
│   ├── displayName: string
│   ├── role: 'admin' | 'manager' | 'staff'
│   ├── permissions: string[]
│   ├── isActive: boolean
│   └── lastLogin: timestamp

userProfiles/
├── {profileId}/
│   ├── userId: string (references users.id)
│   ├── firstName: string
│   ├── lastName: string
│   ├── phone: string
│   ├── preferences: object
│   ├── notifications: object
│   └── timezone: string
```

### Firestore安全规则
完整的Firestore安全规则已配置在 `firestore.rules` 文件中，包括：
- 用户只能访问自己的数据
- 基于角色的访问控制（admin/manager/staff）
- 权限验证机制
- 数据完整性保护

### 认证配置
- 启用邮箱/密码认证
- 配置用户角色权限系统
- 设置密码强度策略
- 集成Firestore用户资料管理

## 📊 数据库设计

### 核心集合
- `cigars` - 雪茄信息
- `customers` - 客户信息
- `events` - 活动信息
- `sales` - 销售记录
- `referrals` - 推荐记录
- `pointsTransactions` - 积分交易
- `loyaltyTiers` - 会员等级

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- 项目链接: [https://github.com/wloong8278-prog/jepcigar](https://github.com/wloong8278-prog/jepcigar)
- 问题反馈: [Issues](https://github.com/wloong8278-prog/jepcigar/issues)

## 🙏 致谢

- [React](https://reactjs.org/) - 用户界面库
- [Ant Design](https://ant.design/) - UI组件库
- [Firebase](https://firebase.google.com/) - 后端服务
- [Vite](https://vitejs.dev/) - 构建工具
- [Netlify](https://www.netlify.com/) - 部署平台
