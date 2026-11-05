# HX · 移动端插画社区

<p align="center">
  <strong>基于 uni-app + Vue 3 + TypeScript 的移动端作品展示与互动前端</strong>
</p>

<p align="center">
  <a href="https://github.com/wek486/Hxh5/actions/workflows/deploy.yml"><img alt="Deploy H5" src="https://github.com/wek486/Hxh5/actions/workflows/deploy.yml/badge.svg"></a>
  <img alt="uni-app" src="https://img.shields.io/badge/uni--app-Vue%203-42b883">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-frontend-3178c6">
  <a href="https://wek486.github.io/Hxh5/"><img alt="GitHub Pages" src="https://img.shields.io/badge/H5-GitHub%20Pages-222222"></a>
</p>

> HX 的移动端 H5 前端仓库。展示作品、搜索与筛选、点赞、关注、评论和个人资料等功能，通过 HTTP API 与独立部署的 Spring Boot 后端通信。
>
> **在线入口：** https://wek486.github.io/Hxh5/ （以 GitHub Actions 和 Pages 实际发布状态为准）

## ✨ 功能

| 模块 | 当前实现 |
| --- | --- |
| 发现 | 作品列表、分类/排序、下拉刷新与分页加载 |
| 搜索 | 根据关键词与筛选条件查找作品 |
| 作品详情 | 查看作品信息和评论 |
| 用户账户 | 注册、登录、修改资料、修改密码、头像上传 |
| 社交互动 | 点赞/取消点赞、关注/取消关注、点赞及关注列表 |
| 移动端体验 | 底部 TabBar、适配手机屏幕、返回顶部 |

功能依赖后端接口以及相应账号权限；后端不可用时部分页面无法正常加载。

## 🧰 技术栈

- **前端框架：** uni-app、Vue 3、TypeScript
- **构建：** Vite 5
- **UI：** uni-ui、自定义 Vue 组件
- **状态：** Vue 3 Composition API / 响应式状态
- **网络请求：** 封装的 `uni.request` 和 `uni.uploadFile`（文件名为 `src/utils/axios.ts`，但并未引入 axios 依赖）
- **托管：** GitHub Pages + GitHub Actions
- **服务端：** 独立的 Spring Boot 服务，通过 Cloudflare Tunnel 提供 HTTPS 入口

## 📁 项目结构

```text
Hxh5/
├── .github/workflows/deploy.yml  # GitHub Pages 自动构建与发布
├── src/
│   ├── api/hx.ts                  # 后端 API 接口定义
│   ├── components/                # 作品、搜索、评论等组件
│   ├── pages/                     # 发现、详情、登录、个人中心等页面
│   ├── static/                    # 本地静态资源
│   ├── stores/                    # 作品、账户及列表状态
│   ├── utils/axios.ts             # HTTP 请求封装、Token 处理
│   ├── App.vue
│   ├── manifest.json
│   └── pages.json
├── .env.example                   # 本地 API 配置示例
├── package.json
├── package-lock.json
└── vite.config.js
```

## 🚀 本地开发

建议使用 **Node.js 20 或 22** 和 npm。

```bash
git clone https://github.com/wek486/Hxh5.git
cd Hxh5
npm ci
npm run dev:h5
```

本地 H5 默认请求 `/api`，由 Vite 开发代理转发至 `http://localhost:8080`，并移除请求路径中的 `/api` 前缀。若后端运行在其他地址，可复制 `.env.example` 为 `.env.local`，设置：

```dotenv
VITE_API_BASE_URL=https://your-api.example.com
```

配置后重新启动开发服务器。设置 `VITE_API_BASE_URL` 会让请求直接访问该地址，不再经过本地 `/api` 代理。请确保后端允许当前前端来源的 CORS 请求。

```bash
# 构建 H5
npm run build:h5

# 开发微信小程序版本（需要小程序平台配置）
npm run dev:mp-weixin

# 构建微信小程序版本
npm run build:mp-weixin
```

> 本仓库当前的自动发布目标是 **H5 网站**，不是微信小程序审核发布。小程序发布还需 AppID、合法域名等平台配置。

## 🌍 GitHub Pages 自动部署

推送到 `master` 分支会触发 [部署工作流](https://github.com/wek486/Hxh5/actions/workflows/deploy.yml)。工作流安装依赖、执行 `npm run build:h5`、检测 H5 产物并发布到 GitHub Pages。

1. 在仓库 **Settings → Pages → Build and deployment** 将 Source 设置为 **GitHub Actions**。
2. 在 **Settings → Secrets and variables → Actions → Variables** 添加仓库变量 `VITE_API_BASE_URL`，值为 Cloudflare Tunnel 暴露的完整 HTTPS 后端根地址（不要带最后的 `/api`，除非后端路径确实包含它）。
3. 在 [Actions](https://github.com/wek486/Hxh5/actions) 查看最新部署状态；成功后访问 https://wek486.github.io/Hxh5/ 。

`VITE_BASE_PATH=/Hxh5/` 由工作流设置，用于确保 GitHub Pages 的 JS/CSS 静态资源路径正确。它与后端 API 的 `VITE_API_BASE_URL` 不同。

**当前工作流还保留了一个临时 `trycloudflare.com` 地址作为变量缺失时的回退值。** 该地址可能随 Tunnel 重启而失效；正式部署请设置稳定域名，并将仓库变量更新为该地址。前端 `VITE_*` 构建变量会写入浏览器可见代码，因此不能存放 Token、数据库密码等敏感密钥。

### 部署链路

```text
手机浏览器 → GitHub Pages（H5 静态文件）
                         ↓ HTTPS API
                  Cloudflare Tunnel
                         ↓
                 Spring Boot / 8080
```

**注意：** GitHub Pages 不代理 API；`vite.config.js` 的 `server.proxy` 仅在本地开发时生效。生产环境会直接请求 `VITE_API_BASE_URL`。后端需要允许来源 `https://wek486.github.io` 的 CORS 请求（以及所需的 OPTIONS 预检）；如果后端通过 Cloudflare Access 保护，还需配置适合浏览器客户端的认证策略。

## 🔍 故障排查

| 问题 | 排查方向 |
| --- | --- |
| Actions 的 `configure-pages` 报 404 | 到 Settings → Pages 启用 GitHub Actions 作为发布来源 |
| 页面空白 / 静态资源 404 | 检查生产 `VITE_BASE_PATH` 是否为 `/Hxh5/` |
| 页面正常、接口失败 | 核对 `VITE_API_BASE_URL`、Tunnel 状态、后端日志与 CORS |
| 本地请求路径不对 | 默认代理会去掉 `/api`，确认 Spring Boot 控制器真实路径 |
| 上传/图片加载异常 | 检查服务端文件 URL、响应权限与相关跨域策略 |

## 🛡️ 安全与协作

- 不要提交 `.env.local`、私有密钥、访问令牌和服务器凭据。
- `VITE_API_BASE_URL` 是公开的 API 域名，不是服务端秘密。
- 修改源码后提交并推送到 `master`，查看 Actions 结果；部署成功后再做手机真机测试。
- 项目页面与接口仍在迭代，功能详情以代码和实际后端为准。

---

如需了解早期的 UI 设计说明，可查看 [UI-NOTES.md](./UI-NOTES.md)（历史记录，部分内容可能已过时）。
