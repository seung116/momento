import { useRef } from 'react'
import { ShellScrollContext } from './ShellScrollContext.js'
import styles from './PhoneShell.module.css'

/**
 * 393 x 852 기준 모바일 앱 셸. 슬롯 방식이라 화면 내용과 셸이 분리됩니다.
 *
 * 합병 시:
 *  - 호스트 앱에 이미 프레임/레이아웃이 있으면 fill="parent" 로 쓰거나,
 *    이 컴포넌트를 쓰지 않고 CapsuleScreen/ArchiveScreen 내부 구성을 호스트 레이아웃에 옮기세요.
 *    (각 Screen은 40줄 정도라 옮기기 쉽게 만들어 두었습니다)
 *  - overlay 슬롯은 frame 기준 absolute 로 깔리므로 바텀시트가 카드 밖으로 새지 않습니다.
 *  - main 의 ref 를 ShellScrollContext 로 내려보냅니다. BottomSheet 가 배경 스크롤을
 *    잠글 때 사용합니다. 자체 레이아웃을 쓰면 같은 Provider 로 스크롤 컨테이너를 넘기세요.
 *
 * @param {object}    props
 * @param {string}    props.title    헤더 제목
 * @param {'viewport'|'parent'} [props.fill]  높이 기준. viewport = 100dvh, parent = 100%
 * @param {ReactNode} [props.fab]    우하단 플로팅 버튼
 * @param {ReactNode} [props.nav]    하단 내비게이션
 * @param {ReactNode} [props.overlay] 시트/모달 등 프레임 전체를 덮는 요소
 * @param {ReactNode} props.children 스크롤 영역(main) 내용
 */
export function PhoneShell({ title, fill = 'viewport', fab, nav, overlay, children }) {
  const mainRef = useRef(null)
  const stageClass = fill === 'parent' ? `${styles.stage} ${styles.stageParent}` : styles.stage

  return (
    // momento-root: 토큰과 스코프 리셋이 걸리는 지점. 반드시 최상단에 있어야 합니다.
    <div className={`momento-root ${stageClass}`}>
      <div className={styles.frame}>
        <header className={styles.header}>
          <strong>{title}</strong>
        </header>
        <main className={styles.main} ref={mainRef}>
          {children}
        </main>
        {fab}
        {nav}
        <ShellScrollContext.Provider value={mainRef}>{overlay}</ShellScrollContext.Provider>
      </div>
    </div>
  )
}
