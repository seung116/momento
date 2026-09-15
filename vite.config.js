import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // plugin-react가 없으면 Fast Refresh가 동작하지 않아 편집 시 매번 전체 리로드됩니다.
  plugins: [react()],
  server: {
    // 기본은 localhost만 바인딩. 실기기 테스트가 필요할 때만 `npm run dev:host`를 쓰세요.
    host: 'localhost',
    // 프로젝트 루트 밖 파일이 dev 서버로 새어 나가지 않도록 유지합니다.
    fs: { strict: true },
  },
})
