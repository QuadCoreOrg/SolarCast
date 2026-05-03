/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GEMINI_API_KEY: string | undefined
  readonly VITE_GEMINI_MODEL: string | undefined
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
