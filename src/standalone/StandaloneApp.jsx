import { useState } from 'react'
import { ArchiveScreen, CapsuleScreen, ROUTES } from '../momento/index.js'

/**
 * ── 단독 실행용 껍데기 (합병 시 버리는 파일) ────────────────────
 * 담당 화면 두 개를 확인하기 위한 최소 라우팅입니다.
 * 합병하면 호스트의 라우터(react-router 등)가 이 역할을 대신하고,
 * 아래처럼 각 Screen에 onNavigate 만 연결하면 됩니다.
 *
 *   <Route path="/capsule" element={<CapsuleScreen onNavigate={navigate} />} />
 *   <Route path="/archive" element={<ArchiveScreen onNavigate={navigate} />} />
 *
 * 홈/친구/마이는 다른 팀원 담당이라 여기서는 비활성 상태로 보입니다.
 * 합병 후 셸 담당자가 availableRoutes 에 전체 목록을 넘기면 활성화됩니다.
 * ──────────────────────────────────────────────────────────────── */
export function StandaloneApp() {
  const [route, setRoute] = useState(ROUTES.capsule)

  if (route === ROUTES.archive) {
    return <ArchiveScreen onNavigate={setRoute} />
  }
  return <CapsuleScreen onNavigate={setRoute} />
}
