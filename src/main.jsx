/*
  ── 진입점 (합병 시 버리는 파일) ────────────────────────────────
  호스트 앱에도 진입점이 있으므로 이 파일을 함께 가져가면 이중 마운트가 됩니다.
  마운트 코드를 화면 컴포넌트와 분리해 둔 이유가 이것입니다.
  ──────────────────────────────────────────────────────────────── */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './standalone/reset.css'
import { StandaloneApp } from './standalone/StandaloneApp.jsx'

const container = document.getElementById('root')
if (!container) {
  throw new Error('index.html에 <div id="root">가 없습니다. 마운트할 대상을 찾지 못했습니다.')
}

createRoot(container).render(
  <StrictMode>
    <StandaloneApp />
  </StrictMode>,
)
