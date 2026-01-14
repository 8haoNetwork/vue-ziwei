# 紫微斗数 Vue 项目

这是一个基于 Vue 3 的紫微斗数盘前端应用，界面及功能仿照测测a、APP，支持本命、大限、流年、流月、流日、流时等不同时间段的切换。

## 系统截图

<p align="center">
  <img src="https://static.apiworks.com/astro/img/ziwei_screenshot_1.png" alt="盘面截图" width="45%" />
  <img src="https://static.apiworks.com/astro/img/ziwei_screenshot_2.png" alt="解读截图" width="45%" />
</p>

## 功能特性

### 核心功能

- 📊 **12宫紫微斗数盘展示** - 传统的 4x4 布局，支持宫位点击高亮
- 🔄 **多时间段切换** - 支持本命、大限、流年、流月、流日、流时切换
- ⚙️ **参数配置** - 完整的设置页面，支持：
  - 出生日期时间设置
  - 性别选择
  - 晚子时处理（23:00-00:00 计算为本日）
  - 飞星自化开关
  - 自定义四化配置（支持多组天干四化选择）
  - 闰月分界设置（月中分隔/隶属本月/隶属下月）
- 📋 **参数页面** - 查看详细的星曜参数和宫位信息
  - 星曜参数表格（星曜、落宫、属性、四化、状态）
  - 宫位-星曜-地支表格（按固定顺序显示）

### 交互功能

- 🎨 **四化颜色标识** - 禄、权、科、忌使用不同颜色显示
- 🔍 **星曜高亮** - 点击宫位后，对应的四化星会高亮显示
- 🎯 **宫位关联** - 点击宫位会自动高亮对宫和三合宫
- 🔄 **自化/对宫化入图标** - 可视化显示星曜的转化关系
- 📐 **格局展示** - 自动显示命盘的格局信息

### 技术特性

- 🌐 **国际化支持** - 完整的中英文翻译支持
- 📱 **响应式设计** - 完美支持移动端和桌面端
- 🎨 **主题颜色系统** - 使用 CSS 变量统一管理颜色
- 🔧 **工具函数模块化** - 代码结构清晰，易于维护

## 技术栈

- **框架**: Vue 3 (Composition API)
- **构建工具**: Vite
- **HTTP 客户端**: Axios
- **国际化**: 自研 i18n 方案
- **样式**: CSS3 + CSS Variables

## 项目结构

```text
vue_ziwei/
├── src/
│   ├── api/
│   │   └── ziwei.js              # API 接口调用
│   ├── components/
│   │   ├── ZiWeiChart.vue        # 主图表组件
│   │   ├── PalaceContent.vue     # 宫位内容组件
│   │   ├── SettingsPanel.vue     # 设置面板组件
│   │   ├── StarParametersPanel.vue # 参数页面组件
│   │   └── TransformIcon.vue     # 自化/对宫化入图标组件
│   ├── utils/
│   │   ├── dataTransform.js      # 数据转换工具
│   │   ├── i18nUtils.js          # i18n 翻译工具函数
│   │   ├── mutagenUtils.js       # 四化工具函数
│   │   ├── palaceUtils.js        # 宫位工具函数
│   │   └── ziweiUtils.js         # 紫微工具函数
│   ├── i18n/
│   │   ├── index.js              # i18n 核心逻辑
│   │   └── locales/
│   │       ├── zh-CN/            # 中文翻译
│   │       └── en-US/            # 英文翻译
│   ├── App.vue                   # 根组件
│   ├── main.js                   # 入口文件
│   └── style.css                 # 全局样式（包含颜色变量定义）
├── index.html
├── package.json
├── vite.config.js
├── proxy-server.js               # API 代理服务器（可选，用于生产环境）
├── .env                          # 环境变量配置文件（需要创建）
└── README.md
```

## 安装

```bash
npm install
```

## 开发

```bash
npm run dev
```

## 构建

```bash
npm run build
```

构建后的文件会在 `dist` 目录中。

## 配置

### 环境变量

在项目根目录创建 `.env` 文件，配置后端 API 地址和相关密钥：

**⚠️ 安全提示**: 前端代码中的环境变量仍然会暴露在打包后的代码中。对于生产环境，强烈建议使用代理服务器方案（见下方"安全配置方案"）。

```env
# 后端 API 地址
VITE_API_BASE_URL=https://cloud.apiworks.com/open/astro

# API 凭证（仅用于开发环境，生产环境请使用代理服务器）
VITE_APP_ID=your_app_id
VITE_APP_KEY=your_app_key
```

### 安全配置方案

**问题**: 在前端代码中直接存储 `appId` 和 `appKey` 是不安全的，因为这些值会被打包到前端代码中，任何人都可以通过浏览器开发者工具查看。

**推荐方案**：使用代理服务器

项目根目录提供了 `proxy-server.js` 作为简单的代理服务器示例：

1. **安装依赖**:

   ```bash
   npm install express cors axios dotenv
   ```

2. **创建代理服务器的 `.env` 文件**:

   ```env
   APP_ID=your_app_id
   APP_KEY=your_app_key
   API_BASE_URL=https://cloud.apiworks.com/open/astro
   PORT=3000
   ```

3. **启动代理服务器**:

   ```bash
   node proxy-server.js
   ```

4. **修改前端配置**:
   将 `VITE_API_BASE_URL` 设置为代理服务器地址：

   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

5. **部署时**:
   - 前端应用部署到静态托管服务（如 Nginx 等）
   - 代理服务器部署到服务器（如 Node.js 服务器、Docker 容器等）
   - 或者使用 Serverless Functions

**替代方案：使用 Serverless Functions**
这样可以避免维护单独的服务器。

### 默认配置

- **默认出生日期**: 1999-09-09 09:09:00
- **默认性别**: 男性
- **默认时区**: 中国时区（+8）

## API 接口说明

### 获取紫微斗数盘数据

后端使用的是[apiworks.com](https://astro.apiworks.com)提供的紫薇斗数接口，需要登录网站申请 `appId` 和 `appKey`。

**⚠️ 安全提示**: 请参考上方"安全配置方案"部分，不要在前端代码中直接暴露 API 凭证。

**接口地址**: `POST /ziwei/chart`

**请求方式**: `POST`

**请求体参数** (JSON):

| 参数名 | 类型 | 必填 | 说明 |
| -------- | ------ | ------ | ------ |
| `birthday` | string | 是 | 出生日期时间，格式: "1999-09-09 09:09:00" |
| `tz` | number | 否 | 时区，默认 8（中国时区） |
| `gender` | string | 是 | 性别：'male' 或 'female' |
| `chart_type` | string | 是 | 盘类型：'natal'/'daxian'/'liunian'/'liuyue'/'liuri'/'liushi' |
| `target_date` | string | 否 | 目标日期时间（用于流年流月等），格式: "2025-01-01 12:00:00" |
| `is_late_zi` | boolean | 否 | 是否使用晚子时处理，默认 false |
| `leap_boundary` | string | 否 | 闰月分界：'mid_month'/'current_month'/'next_month'，默认 'mid_month' |
| `flying_star_self_transform` | boolean | 否 | 飞星自化开关，默认 false |
| `custom_transform_type` | object | 否 | 自定义四化配置，格式：`{"辛": "xin_2", "戊": "wu_2"}` |

**返回数据格式**:

```json
{
  "code": 200,
  "msg": "success",
  "data": {
    "gender": "yin_male",
    "solar_date": "1999-09-09 09:09",
    "lunar_date": "己卯年七月三十巳时",
    "chinese_date": "己卯 壬申 甲子 己巳",
    "zodiac": "兔",
    "five_elements_class": "fire6th",
    "origin_palace_idx": 4,
    "body_palace_idx": 10,
    "origin": {
      "palaces": [...],
      "mutagen_stars": {...}
    },
    "decadal": {...},
    "yearly": {...},
    "monthly": {...},
    "daily": {...},
    "hourly": {...},
    "patterns": [...]
  },
  "exe_time": 0.123
}
```

**注意**:

- 前端会自动处理后端的 `ApiResp` 响应格式，提取 `data` 字段
- 宫位索引从 0-11，后端按固定顺序返回（从寅宫开始）
- 前端会自动将宫位重新排序，从命宫开始显示
- 四化信息通过 `mutagen_stars` 字典和星曜的 `transform_types` 字段提供

## 使用说明

### 基本操作

1. **查看命盘**: 启动应用后，自动加载默认的紫微斗数盘数据
2. **切换时间段**: 点击底部的 Tab 切换不同的时间段（本命、大限、流年、流月、流日、流时）
3. **修改参数**: 点击右上角"设置"按钮，可以修改出生时间、性别等参数
4. **查看参数**: 点击右上角"参数"按钮，可以查看详细的星曜参数和宫位信息
5. **查看格局**: 格局信息显示在图表下方，自动展开显示

### 高级功能

- **宫位高亮**: 点击任意宫位，会自动高亮该宫位及其对宫、三合宫
- **四化高亮**: 点击宫位后，该宫位中包含的四化星会以对应颜色高亮显示
- **自定义四化**: 在设置页面可以配置不同天干的四化方案（如 廉破武阳/廉破曲阳 等）

## 数据转换说明

前端会自动将后端返回的数据格式转换为前端展示格式：

1. **宫位排序**: 后端宫位按固定顺序返回，前端会重新排序从命宫开始显示
2. **四化处理**:
   - 通过 `mutagen_stars` 字典识别星曜的四化类型
   - 通过星曜的 `transform_types` 字段识别自化/对宫化入
3. **运限数据合并**: 根据当前选择的 Tab，自动合并对应的运限星曜到各宫位
4. **响应格式**: 自动处理后端的 `ApiResp` 格式，提取 `data` 字段

## 颜色系统

### 运限颜色

在 `src/style.css` 中定义：

- `--color-horoscope-benming`: #e53131 (深红色 - 本命)
- `--color-horoscope-daxian`: #592599 (蓝紫色 - 大限)
- `--color-horoscope-liunian`: #f58f00 (橙色 - 流年)
- `--color-horoscope-liuyue`: #388e3c (绿色 - 流月)
- `--color-horoscope-liuri`: #954932 (棕色 - 流日)
- `--color-horoscope-liushi`: #03a9f4 (浅蓝色 - 流时)

### 四化颜色

在 `src/style.css` 中定义：

- `--color-mutagen-lu`: #4caf50 (绿色 - 禄)
- `--color-mutagen-quan`: #ff9800 (橙色 - 权)
- `--color-mutagen-ke`: #2196f3 (蓝色 - 科)
- `--color-mutagen-ji`: #f44336 (红色 - 忌)

## 工具函数说明

### i18nUtils.js

提供统一的翻译函数：

- `translateStarName()` - 翻译星曜名称
- `translatePalaceName()` - 翻译宫位名称
- `translateBrightness()` - 翻译亮度状态
- `translateEarthlyBranch()` - 翻译地支名称
- `translateGender()` - 翻译性别
- `translateFiveElementsClass()` - 翻译五行局

### mutagenUtils.js

提供四化相关工具函数：

- `normalizeMutagenType()` - 标准化四化类型（如 `sihuaLu` → `lu`）
- `getMutagenText()` - 获取四化类型的翻译文本

### palaceUtils.js

提供宫位相关工具函数：

- `sortPalacesFromOrigin()` - 从命宫开始排序宫位
- `mergeHoroscopeData()` - 合并运限数据到宫位

## 开发说明

### 修改默认配置

- 修改 `src/App.vue` 中的 `defaultBirthInfo` 可以设置默认的出生信息
- 修改 `src/api/ziwei.js` 中的 `baseURL` 或使用 `.env` 文件配置后端 API 地址

### 添加翻译

在 `src/i18n/locales/zh-CN/` 和 `src/i18n/locales/en-US/` 目录下添加对应的翻译文件。

### 自定义样式

在 `src/style.css` 中修改 CSS 变量可以统一调整颜色主题。

## 浏览器支持

- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)
- 移动端浏览器

## 开源协议

本项目采用 [MIT License](LICENSE) 开源协议。

## 贡献

欢迎提交 Issue 和 Pull Request！

详细的贡献指南请查看 [CONTRIBUTING.md](CONTRIBUTING.md)

## 相关链接

- 项目地址: [GitHub](https://github.com/8haoNetwork/vue-ziwei) | [Gitee](https://gitee.com/wingerd/vue-ziwei)
- API 文档: [apiworks.com](https://astro.apiworks.com)

## 许可证

MIT License
