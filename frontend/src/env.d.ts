/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_GOOGLE_CLIENT_ID: string
    readonly VITE_GOOGLE_CLIENT_SECRET: string
    readonly VITE_SANITY_PROJECT_ID: string
    readonly VITE_SANITY_TOKEN: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }