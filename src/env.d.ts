/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly PUBLIC_API_BASE_URL: string;
    readonly PUBLIC_IMAGE_BASE_URL: string;
    readonly PUBLIC_USE_LOCAL_BACKEND: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
