# 本地模型文件

此目录用于存放 `face-api.js` 的离线模型文件。运行项目时，情绪识别组件只会从本地 `/models` 读取模型，不会请求远程链接或 CDN。

## 必需文件

请确保此目录包含以下 4 个文件：

1. `tiny_face_detector_model-shard1`
2. `tiny_face_detector_model-weights_manifest.json`
3. `face_expression_model-shard1`
4. `face_expression_model-weights_manifest.json`

## 使用方式

模型文件已经放在本目录后，直接启动前端项目即可离线使用：

```bash
npm run dev
```

如果需要迁移到另一台电脑，请把整个 `public/models` 目录一起复制过去。

可以运行下面的命令检查本地模型文件是否齐全：

```bash
npm run check:models
```
