<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# WIC EDU KG Frontend

一个现代化的大学校园信息管理系统前端应用，提供校园地图、聊天、美食、图书馆等多项功能。

## 📋 项目概述

本项目是为WIC.EDU.KG大学开发的综合校园信息平台前端，旨在为学生和教职员工提供便捷的校园生活支持。

### 核心功能

- 🏫 **校园地图** - 交互式2D/3D校园导航和POI查询
- 💬 **AI聊天** - 智能对话助手（集成Gemini API）
- 🍽️ **美食管理** - 校园食堂菜单浏览和餐饮信息
- 📚 **图书馆** - 图书检索和借阅管理
- 📸 **相册库** - 校园活动照片展示
- 👥 **个人资料** - 学生和教职员工信息管理
- 🌐 **多语言支持** - 支持中英文切换
- 🎨 **深色模式** - 响应式主题切换

## 🛠️ 技术栈

| 类别 | 技术 |
|------|------|
| **框架** | React 19 + TypeScript |
| **路由** | React Router v7 |
| **样式** | Tailwind CSS |
| **构建** | Vite |
| **动画** | Framer Motion |
| **地图** | Leaflet + Mapbox GL |
| **UI组件** | Lucide Icons, Emoji Picker |
| **富文本** | React Markdown (GFM) |
| **数据压缩** | Pako |
| **动画格式** | Lottie |

## 📁 项目结构

```
src/
├── components/          # 可复用UI组件
│   ├── CampusMap.tsx           # 2D校园地图
│   ├── CampusMap3D.tsx         # 3D校园地图
│   ├── ChatMessage.tsx         # 聊天消息组件
│   ├── ChatInput.tsx           # 聊天输入框
│   ├── Navbar.tsx              # 导航栏
│   ├── Footer.tsx              # 页脚
│   ├── LoadingScreen.tsx       # 加载屏幕
│   ├── MeteorEffect.tsx        # 流星效果（深色模式）
│   └── ...其他组件
├── pages/               # 页面组件
│   ├── Home.tsx                # 首页
│   ├── Chat.tsx                # 聊天页面
│   ├── Food.tsx                # 美食列表
│   ├── FoodDetail.tsx          # 美食详情
│   ├── Library.tsx             # 图书馆
│   ├── Gallery.tsx             # 相册
│   ├── Profile.tsx             # 个人资料
│   ├── Login.tsx               # 登录页面
│   ├── About.tsx               # 关于页面
│   └── Seniors.tsx             # 高年级学生页面
├── context/             # React Context（全局状态）
│   ├── LanguageContext.tsx     # 语言切换状态
│   ├── ThemeContext.tsx        # 主题切换状态
│   ├── UserContext.tsx         # 用户信息状态
│   └── MobileMenuContext.tsx   # 移动端菜单状态
├── services/            # 业务服务层
│   ├── apiClient.ts            # API客户端配置
│   ├── authService.ts          # 认证服务
│   ├── departmentService.ts    # 部门服务
│   ├── galleryService.ts       # 相册服务
│   ├── geoLocationService.ts   # 地理位置服务
│   └── stickerService.ts       # 贴纸服务
├── data/                # 静态数据
│   └── campus-poi.ts           # 校园POI数据
├── types/               # TypeScript类型定义
│   └── sticker.ts              # 贴纸类型
├── App.tsx              # 应用主组件
├── LanguageContext.tsx  # 全局语言上下文
├── ThemeContext.tsx     # 全局主题上下文
├── UserContext.tsx      # 全局用户上下文
└── index.tsx            # 应用入口
```

## 🚀 快速开始

### 前置条件

- Node.js 16+ 
- npm 或 yarn 包管理器

### 安装和运行

1. **克隆仓库**
   ```bash
   git clone https://github.com/opxqo/wic-deu-kg-frontend.git
   cd wic-deu-kg-frontend
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   
   创建 `.env.local` 文件并配置以下内容：
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_API_BASE_URL=your_api_base_url
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```
   应用将在 `http://localhost:3000` 启动

5. **构建生产版本**
   ```bash
   npm run build
   ```

6. **预览构建结果**
   ```bash
   npm run preview
   ```

## 🔧 开发指南

### 添加新页面

1. 在 `src/pages/` 中创建新的 `.tsx` 文件
2. 在 `App.tsx` 中添加路由配置
3. 在 `Navbar.tsx` 中添加导航链接

### 添加新组件

1. 在 `src/components/` 中创建组件文件
2. 遵循现有组件的代码风格（TypeScript + React函数式）
3. 使用Tailwind CSS处理样式

### 全局状态管理

项目使用React Context处理全局状态：
- **LanguageContext** - 用于多语言切换
- **ThemeContext** - 用于深色/浅色模式
- **UserContext** - 用于用户登录状态和信息
- **MobileMenuContext** - 用于移动端菜单控制

## 📦 主要依赖说明

| 包名 | 版本 | 用途 |
|------|------|------|
| `react` | ^19.2.0 | UI框架 |
| `react-router-dom` | ^7.9.6 | 路由管理 |
| `framer-motion` | ^12.23.24 | 动画库 |
| `leaflet` | 1.9.4 | 地图库 |
| `mapbox-gl` | ^3.16.0 | 高级地图功能 |
| `emoji-picker-react` | ^4.9.2 | Emoji选择器 |
| `react-markdown` | 9 | Markdown渲染 |
| `lucide-react` | ^0.555.0 | 图标库 |

## 🎯 特色功能

### 智能聊天系统
- 集成Google Gemini API
- 支持文件附件上传
- 实时消息推送
- 聊天记录保存

### 交互式地图
- 2D和3D校园地图切换
- POI信息查询
- 地理围栏检测
- 动态路线规划

### 响应式设计
- 完全适配移动设备
- Tailwind CSS响应式布局
- 触摸优化的交互界面

## 📝 许可证

[添加您的许可证信息]

## 🤝 贡献

欢迎提交Issue和Pull Request！

## 👨‍💻 作者

opxqo

## 📞 联系方式

- 邮箱: 2547364328luo@wic.edu.kg
- GitHub: https://github.com/opxqo
