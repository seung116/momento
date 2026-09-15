/**
 * ── momento 공개 API ────────────────────────────────────────────
 * 합병할 때 이 폴더(src/momento)만 통째로 복사하고, 아래에서 필요한 것만 import 하세요.
 * 이 폴더 안의 코드는 다음을 하지 않습니다:
 *   - createRoot / ReactDOM 마운트
 *   - 전역 리셋(body, #root, * 등) 정의
 *   - 라우터 소유
 *   - index.html 수정
 * 따라서 호스트 앱의 진입점, 리셋, 라우터와 충돌하지 않습니다.
 *
 * 필요 의존성: react >= 18, lucide-react (^1)
 * 필요 빌드 기능: CSS Modules (*.module.css) — Vite / Next / CRA 모두 기본 지원
 * ──────────────────────────────────────────────────────────────── */

// 스코프 베이스(토큰 + .momento-root 하위 리셋). 이 폴더에서 무엇을 쓰든 한 번은 로드되어야 합니다.
import './momento.css'

export { ROUTES, OWNED_ROUTES } from './routes.js'

export { CapsuleScreen } from './capsule/CapsuleScreen.jsx'
export { ArchiveScreen } from './archive/ArchiveScreen.jsx'

// 셸/내비는 합병 후 호스트가 소유할 수 있으므로 개별로도 노출합니다.
export { PhoneShell } from './shell/PhoneShell.jsx'
export { ShellScrollContext } from './shell/ShellScrollContext.js'
export { BottomNav, DEFAULT_NAV_ITEMS } from './shell/BottomNav.jsx'

// 공통 바텀시트. 다른 화면에서도 재사용하세요.
export { BottomSheet } from './ui/BottomSheet.jsx'

// 목업 데이터. 실제 데이터로 교체하면 import를 지우면 됩니다.
export { capsules, CAPSULE_TABS } from './capsule/capsuleData.js'
export { archives } from './archive/archiveData.js'
