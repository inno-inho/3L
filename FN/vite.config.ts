import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 0.0.0.0으로 노출하여 도커 외부에서 접속 가능하게 함
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://backend:8080',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '') // 이 부분 슬래시 확인!
      }
    }
  }
})