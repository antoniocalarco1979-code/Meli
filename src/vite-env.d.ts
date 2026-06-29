/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  /** Abilita seed automatico nel DB produzione (solo dev/staging). */
  readonly VITE_DEMO_SEED?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
