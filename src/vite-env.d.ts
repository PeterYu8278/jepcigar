/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly PROD: boolean
  readonly DEV: boolean
  readonly MODE: string
  // 添加其他环境变量类型定义
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
