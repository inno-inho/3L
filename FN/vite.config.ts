import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 0.0.0.0으로 노출하여 도커 외부에서 접속 가능하게 함
    port: 5173,
    proxy: {
      '/api': {
        // target: 'http://backend:8080',         // 배포 시 혹은 도커로 전부 돌릴거면
        target: 'http://host.docker.internal:8080', // 개발 시 로컬로 백엔드 실행하기
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '') // 백엔드 API가 /api를 포함하지 않는다면 이 주석 해제하면 됨
      },
      // 웹소켓(WebSocket) 프록시 설정
      '/ws': {
        // target: 'http://backend:8080',         // 배포 시 혹은 도커로 전부 돌릴거면
        target: 'http://host.docker.internal:8080', // 개발 시 로컬로 백엔드 실행하기
        ws: true, // WebSocket 프록시 활성화
        changeOrigin: true,
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),  // @ === /src
    },
  }
})