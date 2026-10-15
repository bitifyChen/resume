import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  base: './',
  plugins: [vue(), Components({ dts: false, resolvers: [ElementPlusResolver()] })],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: { port: 5277, strictPort: true },
  preview: { port: 4277, strictPort: true },
  build: { sourcemap: false, chunkSizeWarningLimit: 700 }
})
