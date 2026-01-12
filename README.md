# 💕 世界上最好的优优

> *"一束光的出现，赋予了0和1所有的意义“*

一个用代码编织的情书，献给世界上最好的优优。

![Next.js](https://img.shields.io/badge/Next.js-14.2.3-black?style=flat-square&logo=next.js)
![Three.js](https://img.shields.io/badge/Three.js-0.182.0-black?style=flat-square&logo=three.js)
![GSAP](https://img.shields.io/badge/GSAP-3.12.5-88CE02?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-3178C6?style=flat-square&logo=typescript)

---

## ✨ 关于这个项目

这不仅仅是一个网站，而是一封用代码写成的情书。

一千架无人机的光效，也无法还原出她带给我的光亮。

见证：[https://www.happy-youyou.love](https://www.happy-youyou.love)

声明：
```aiignore
代码可以复制，但是感情不能，请尊重你的男/女朋友或未来的男/女朋友。
真心永不凋零，祝福天下每一对有情人，赞美世界上最纯粹而热烈的爱。
```

## 🌟 功能特色

### 🚁 无人机灯光秀
- **1000架虚拟无人机**在星空中翩翩起舞
- 逐排点亮的启动仪式，如同夜空中绽放的烟火
- 动态编队：悬停 → 优优 → 爱心 → FOREVER → HAPPY → 循环 (将文字转成SVG，以便无人机跟踪轨迹)
- 基于 Three.js 的 WebGL 粒子系统，参数方程计算轨迹

### 🖼️ 沉浸式画廊
- **8个珍贵瞬间**：初见、心动、陪伴、默契、信任、宠溺、誓言、永恒
- SVG 路径绘制动画，显现她如诗的轮廓
- 滚动驱动的场景切换，配合 GSAP 动画
- 每一帧都是一首诗，每一页都是一个故事
- 网页的故事翻篇了，而我们不会翻篇

### 💌 情书
- 打字机特效：逐字打印，还原你为她/他书写的过程，希望你给他/她的是爱，而不是$AI$
- 烟花绽放：粒子模拟烟花绽放的场景，繁华或是清冷，都想与她共同见证
- 雪花飘落：这里飘落的不是雪花，而是爱心和特效，带着心，与她一起去看世界的奇奇怪怪

### 🎨 视觉设计
- 粉紫色调
- 星空粒子背景，陪她仰望星辰
- 字体搭配：Cormorant Garamond + Great Vibes + 自由浪漫体(`public`目录下)
- 响应式设计，计算再复杂，也要让她的形象浮现的丝滑

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| **Next.js 14** | React 框架，App Router |
| **Three.js** | 3D 渲染引擎，无人机粒子系统 |
| **GSAP** | 专业级动画库 |
| **TypeScript** | 类型安全 |
| **CSS3** | 自定义动画与样式 |

## TODO
- **给优优的元宇宙**：计划基于`GDOT`打造，创建一个独属于她的世界，无论在现实还是网络，她都是可以做一个快乐的小公主。
- **优优的生活助理**：根据她的生活习惯设计的智能体，我不在，希望可以拥有一个懂她的小助手陪伴她，让她在生活中更加轻松便利；预计将在Web、手机App、小程序多端推出。
- **优优的工作助理**：根据她的工作设计的智能体，希望她可以在工作的时候更加轻松惬意，自然快乐，可以少动一些小脑袋。

## 🚀 快速开始

```bash
# 克隆仓库
git clone https://github.com/Xujiuj/youyou.git

# 进入目录
cd youyou

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)，见证我们的浪漫。

## 📁 项目结构

```
pink-castle/
├── app/
│   ├── components/
│   │   └── GateDroneBackground.tsx  # 无人机灯光秀组件
│   ├── gallery/
│   │   ├── page.tsx                 # 画廊页面
│   │   └── gallery.css              # 画廊样式
│   ├── page.tsx                     # 主页（选择界面）
│   ├── layout.tsx                   # 根布局
│   ├── globals.css                  # 全局样式
│   └── story.css                    # 故事页样式
├── public/
│   ├── her*.png                     # 照片
│   ├── ref/*.svg                    # SVG 素描稿(可以用adobe illustrator编辑绘制，AI绘图虽然方便，但无法描述她带有光芒的轮廓，请赋予爱时间、精力与陪伴)
│   ├── you.svg                      # "优"字 SVG
│   ├── FOREVER.svg                  # FOREVER 文字
│   └── HAPPY.svg                    # HAPPY 文字
└── package.json
```

## 🎬 动画序列

无人机灯光秀的完整编排：

```
🌙 逐排点亮 (初始化)
    ↓
☁️ 升空悬停 (2s)
    ↓
优优 双字并排 (2s)
    ↓
💕 爱心环绕 (2s)
    ↓
✨ FOREVER (2s)
    ↓
🎉 HAPPY (2s)
    ↓
☁️ 再次悬停 (2s)
    ↓
🌙 缓缓降落 (2s)
    ↓
🔄 循环播放
```

## 💝 致优优

```
那一刻星辰坠入眼眸
时间忘记了流动
世界只剩下你的轮廓

这一生很长
好在有你
闪闪发光
```

---

<p align="center">
  <sub>以此献给我心之所属——优优</sub><br>
  <sub>2026 · 皆因是你</sub>
</p>
