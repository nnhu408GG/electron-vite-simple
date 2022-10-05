import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

  // 设置打包后的路径
  build: {
    outDir: './dist/view',
  },
})
