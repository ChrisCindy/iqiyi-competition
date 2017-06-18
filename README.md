# 爱奇艺 lite

> 爱奇艺全国高校技术大赛最强开发者 H5 组个人参赛作品
>
> 队名：LAClippers
>
> 队员：殷献勇 北京邮电大学

## 开发

``` bash
# 安装依赖包
npm install

# 于本机 localhost:8080 启动开发服务器进行项目预览
npm run dev

# 压缩并生成生产环境所用的包
npm run build

# 压缩并生成生产环境所用的包，同时查看正式包的分析报告
npm run build --report
```

## 上线

```bash
# 压缩并生成生产环境所用的包
# 放置于 dist 目录下
npm run build

# 将 dist 文件夹部署于 nginx、Apache 等静态文件服务器上
# 或者通过 express/flask/play 等 web 框架提供静态文件的功能进行部署
```

## 线上预览

本项目已部署至线上，[点我预览](http://chriscindy.gitlab.io/iqiyi-competition)

## 本地预览

```bash
# 于本机 localhost:8080 启动开发服务器进行项目预览
# 服务器启动后自动打开本机浏览器进行页面预览
npm run dev

# 使用手机预览时，首先将手机和电脑连接至同一子网下，然后在手机端打开 http://<your-computer-ip>:8080 进行预览
```

-----

## 应用介绍

### 背景

在这个视频行业竞争如此激烈的时代，大而全的应用往往让用户失去专注度，功能太多可能会让用户无从下手。在国外，得益于国外剧集（如美剧等）的更新机制，追剧应用存在重要的市场。而相对专业并且只聚焦于追剧的应用在国内则不多见。在国内剧集以及综艺节目的更新机制越来越与国外市场接轨时，一款好的追剧应用亟待出现。

### 定位

爱奇艺 lite 定位于一个追剧管理 webapp，其剔除了爱奇艺 webapp 本身相对臃肿的其他功能，只专注于追剧，可以让用户的注意力只聚焦于追剧本身，这也是「lite」的含义所在。

-----

## 代码结构

```bash
.
├── README.md    
├── build
├── config
├── dist
├── index.html
├── node_modules
├── package.json 
├── src  # 源码目录
│   ├── App.vue  # 根组件
│   ├── api  # 封装爱奇艺接口
│   ├── assets  # 存放图片、CSS 等静态资源
│   ├── auth.js  # 账号体系
│   ├── components  # 通用组件
│   ├── database  # 数据库配置及暴露接口
│   ├── main.js  # 入口 JS 文件
│   ├── router  # 路由配置
│   ├── utils  # 定制函数工具库
│   ├── views  # 页面
│   │   ├── auth # 账号体系相关页面
│   │   │   ├── ChangePassword.vue
│   │   │   ├── Login.vue
│   │   │   ├── RetrievePassword.vue
│   │   │   └── Signup.vue
│   │   ├── common  # 通用页面
│   │   │   └── VideoDetail.vue
│   │   └── content  # 主体内容页面
│   │       ├── Content.vue
│   │       ├── account  # 账号页面
│   │       │   └── Account.vue
│   │       ├── explore  # 发现页面
│   │       │   ├── ChannelDetail.vue
│   │       │   └── Explore.vue
│   │       ├── follow  # 关注页面
│   │       │   ├── Favorite.vue
│   │       │   ├── Follow.vue
│   │       │   └── Track.vue
│   │       └── search  # 搜索页面
│   │           └── Search.vue
│   └── vuex  # 全局存储、组件间通信
├── static
└── test
```

-----

## 技术优势

### 1. 单页面应用

采用 Vue 全家桶（Vue.js + Vue-Router + Vuex）进行 SPA 开发，保证了流畅快捷的使用体验。

### 2. 数据持久化

采用基于 IndexedDB 的数据库 Dexie 进行数据的持久化，减少 HTTP 请求，同时实现在无服务端的情况下拥有一套相对完整的账号体系。后续如果接入自有服务端，将可实现平滑升级。

### 3. 设计元素

采用开源组件库 Muse-UI，使得整个应用遵从 Google 提出的 Material Design 标准，从视觉上以统一的体验给用户以良好的使用感受。

### 4. 原生 JavaScript

全部采用 ES6 进行编写，性能显著高于 jQuery 等第三方库。

-----

## 未来优化

时间所限，本应用可优化的点还有很多，以下列举几点：

### 1. 首屏加载速度

属于 Vue SPA 的常见问题，可以考虑采用服务端渲染技术进行进一步优化。

### 2. 静态资源缓存

可在 service worker 进程中进行必要的静态资源缓存，减轻网络压力

### 3. 接入服务端

目前的账户体系依赖于浏览器本地的数据库，安全性以及灵活性都不如真实的服务端，未来可考虑接入。

### 4. 代码优化

引入 RxJS 对代码进行重构，提升编码可靠性以及可维护性。