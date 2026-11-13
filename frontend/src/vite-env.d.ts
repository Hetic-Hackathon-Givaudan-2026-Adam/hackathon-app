/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Adresse de l'API de l'assistant (ex. http://localhost:8000 ou l'adresse ngrok). */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
