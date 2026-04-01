import { defineConfig } from "vite";
import UnoCSS from 'unocss/vite'
import svg from '@neodx/svg/vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';

const host = process.env.TAURI_DEV_HOST;

export default defineConfig(async () => ({
  plugins: [
    solidPlugin(),
    UnoCSS(),
    devtools(), 
    svg({
      inputRoot: 'src/assets/svg',
      output: 'public/sprites',
      fileName: '{name}.{hash:8}.svg',
      metadata: 'src/shared/sprite.gen.ts',
      resetColors: false
    })
  ],
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // Env variables starting with the item of `envPrefix` will be exposed in tauri's source code through `import.meta.env`.
  envPrefix: ['VITE_', 'TAURI_ENV_*'],
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
        protocol: "ws",
        host,
        port: 1421,
      }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
  build: {
    target: "esnext",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          if (id.includes('node_modules/solid-js')) return 'solid-core';
          if (id.includes('reatom')) return 'reatom';

          return 'libs-vendor';
        }
      }
    }
  },
  resolve: {
    alias: {
      'tailwind-variants': 'tailwind-variants/lite',
    }
  },
}));
