# 贡献指南

感谢您对本项目的关注！我们欢迎任何形式的贡献。

## 如何贡献

### 报告问题

如果您发现了 bug 或有功能建议，请：

1. 在 GitHub/Gitee Issues 中搜索是否已有相关问题
2. 如果没有，请创建一个新的 Issue，详细描述问题或建议

### 提交代码

1. **Fork 本项目**
2. **创建特性分支** (`git checkout -b feature/AmazingFeature`)
3. **提交更改** (`git commit -m 'Add some AmazingFeature'`)
4. **推送到分支** (`git push origin feature/AmazingFeature`)
5. **开启 Pull Request**

### 代码规范

- 使用 ESLint 进行代码检查
- 遵循 Vue 3 官方风格指南
- 提交信息使用中文或英文均可，但请清晰描述改动内容

### 开发环境设置

1. 克隆项目
   ```bash
   git clone https://github.com/your-username/vue-ziwei.git
   cd vue-ziwei
   ```

2. 安装依赖
   ```bash
   npm install
   ```

3. 配置环境变量
   ```bash
   cp .env.example .env
   # 编辑 .env 文件，填入你的 API 凭证
   ```

4. 启动开发服务器
   ```bash
   npm run dev
   ```

## 代码风格

- 使用 2 空格缩进
- 使用单引号
- 组件名使用 PascalCase
- 文件名使用 camelCase

## 提交 Pull Request

在提交 PR 前，请确保：

- [ ] 代码已通过 ESLint 检查
- [ ] 已添加必要的注释
- [ ] 已更新相关文档
- [ ] 提交信息清晰明了

## 许可证

通过提交代码，您同意将您的贡献在 MIT 许可证下授权。

