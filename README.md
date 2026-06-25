# 写码也写心

## 推送代码到 github

添加新的远程仓库（github）

```shell
git remote add github https://github.com/penn6699/penn6699.github.io.git
```

覆盖远程仓库（github）

```shell
git push github master --force
```

更新后，提交远程仓库（github）

```shell
git push github master
```

## vitepress-plugin-llms 插件让文档“读懂”大模型，LLM 友好度拉满！

vitepress-plugin-llms 是一个专为 VitePress 文档站点设计的插件，旨在通过生成适合大型语言模型（LLM）处理的文档格式，提升文档的 AI 可解析性。该插件由 Vue 和 Vite 的作者尤雨溪推荐，解决了现代技术文档难以被 AI 工具（如 ChatGPT、Claude、Cursor 等）有效读取的问题。

[VitePress 新插件让文档“读懂”大模型，LLM 友好度拉满！](https://mp.weixin.qq.com/s/dhq2ls-RsoYVwK96BuFtSQ)

#### 核心功能

1. **自动生成 LLM 友好文档**：

   - `llms.txt`：包含所有文档章节链接的索引文件，相当于给 AI 看的"地图"。
   - `llms-full.txt`：将整个站点的文档内容合并到一个文件中，方便 LLM 一次性读取完整上下文。
   - 每页的 LLM 友好 Markdown 文件：为每个页面生成精简的 Markdown 文件。
2. **双面内容控制**：

   - `<llm-only>`标签：标记只给 AI 看的内容，如给 AI 的特定指令或详细代码上下文。
   - `<llm-exclude>`标签：标记只给人类看的内容，如广告、交互式 Demo 等视觉装饰元素。
3. **HTML 清理与智能集成**：

   - 自动去除 HTML 标签，生成更干净的文本。
   - 根据 VitePress 的侧边栏配置自动生成文档结构。

安装插件：

```shell
# 使用 npm
npm install vitepress-plugin-llms --save-dev

# 使用 pnpm
pnpm install vitepress-plugin-llms --save-dev
```

在 VitePress 配置文件 `.vitepress/config.ts`中引入并注册插件：

```shell
import { defineConfig } from 'vitepress'
import llms from 'vitepress-plugin-llms'

export default defineConfig({
  // ... 其他配置
  vite: {
    plugins: [
      llms({
        // 可选配置项
        siteUrl: 'https://your-documentation-site.com'
      })
    ]
  }
})
```

或

```shell
import { defineConfig } from 'vitepress'
import llms from 'vitepress-plugin-llms'

export default defineConfig({
  // ... 其他配置
  vite: {
    plugins: [
      llms()
    ]
  }
})
```

运行构建命令后，插件会在 .vitepress/dist文件夹中生成以下文件

```shell
.vitepress/dist/
├── llms-full.txt      // 所有文档内容合并到一个文件
├── llms.txt           // 包含所有章节链接的索引文件
├── section-name.html  // 原始 HTML 文件
└── section-name.md    // LLM 友好的 Markdown 文件
```

高级配置选项

```shell
llms({
  // 关闭 llms-full.txt 的生成
  generateLLMsFullTxt: false,

  // 忽略特定文件或目录
  ignoreFiles: ['sponsors/*', 'api/*'],

  // 自定义 llms.txt 模板
  customLLMsTxtTemplate: `# {title}\n\n{foo}`,

  // 自定义标题
  title: 'Awesome tool',

  // 自定义模板变量
  customTemplateVariables: { foo: 'bar' },

  // 自定义输出目录
  outputDir: './llm-docs'
})
```

#### 实际应用场景

1. **AI 编程助手集成**：让 ChatGPT、Claude、Cursor 等 AI 工具能够更好地理解和引用你的文档内容。
2. **智能客服系统**：基于文档训练的 LLM 助手可以快速检索相关文档段落，精准输出解决方案。
3. **跨平台知识共享**：生成的 Markdown 文件可在 ChatGPT 插件、Notion AI、企业自建 LLM API 等平台自由流转。

#### 注意事项

1. 该插件遵循 llmstxt.org 标准，确保生成的文档格式规范。
2. 已被 Vue.js、Vite、Slidev 等知名开源项目采用。
3. 对于动态组件和复杂格式的处理可能存在一定挑战，但随着技术迭代正在不断优化。

通过使用 vitepress-plugin-llms，你可以让文档在 AI 时代也能"丝般顺滑"地被理解和引用，提升开发者和用户的整体体验。

## vitepress-plugin-pagefind 插件

vitepress-plugin-pagefind 是一个为 VitePress 文档站点提供离线全文搜索功能的插件。它基于 Pagefind 搜索库实现，解决了 VitePress 官方目前没有内置开箱即用搜索能力的问题。

#### 插件概述

VitePress 官方文档推荐使用 Algolia DocSearch，但申请流程相对较慢，且公司内网文档无法接入使用。另一个方案 vitepress-plugin-search 基于 flexsearch 实现，但默认 UI 较丑且对中文没有提供开箱即用的支持。vitepress-plugin-pagefind 提供了一个更好的替代方案。

Pagefind 是一个完全静态的搜索库，基于 Rust 实现，直接解析构建后的 HTML 页面内容，然后自动构建索引文件。它具有以下特点：

- 框架无关，可在 Hugo、Eleventy、Jekyll、Next、Astro、SvelteKit 等任何 SSG 之后运行
- 仅需要一个包含构建的静态文件的文件夹，大多数情况下无需配置即可使用
- 索引后，会向构建文件添加静态搜索包，提供 JavaScript 搜索 API
- 提供预构建 UI，无需配置即可使用

#### 安装步骤

只需要 2 步即可完成接入：

1. **安装插件**

   ```shell
   npm i vitepress-plugin-pagefind
   # 或
   yarn add vitepress-plugin-pagefind
   # 或
   pnpm add vitepress-plugin-pagefind
   ```
2. **在配置文件中引入**
   在 .vitepress/config.ts中配置：

   ```shell
   import { defineConfig } from 'vitepress'
   import { pagefindPlugin } from 'vitepress-plugin-pagefind'

   export default defineConfig({
     vite: {
       plugins: [pagefindPlugin()],
     }
   })
   ```

其他
