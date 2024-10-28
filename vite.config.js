import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// import ElementPlus from 'unplugin-element-plus/vite'

// https://vitejs.dev/config/
export default defineConfig({
  css : {
    preprocessorOptions : {
      scss: {
        api: 'modern-compiler'
      }
    }
  },
  plugins: [
      vue(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      // ElementPlus()
  ],
    server : {
      open : true,
        host: "127.0.0.1",
        port: 8081
    },
    base: '/fc',
    mode: 'dev'
})
