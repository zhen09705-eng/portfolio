# 刁真真 · 品牌视觉设计作品集

静态作品集网站，发布文件位于 `dist/`。页面以中文展示品牌全案、宣传片、插画项目与个人经历。

## 本地预览

使用任意静态 HTTP 服务托管 `dist/` 即可预览。Cloudflare Pages 配置为：根目录留空、构建命令留空、构建输出目录填写 `dist`，生产分支为 `main`。

## 大型媒体

Cloudflare Pages 单个静态资源有 25 MiB 上限。汪福宣传片保存在仓库根目录的 `cloudflare-media/`，页面通过 GitHub Raw 加载；其余静态页面资源由 Pages 提供。
