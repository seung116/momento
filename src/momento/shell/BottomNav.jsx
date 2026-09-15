import { Archive, Home, Timer, UserRound, UsersRound } from 'lucide-react'
import { OWNED_ROUTES, ROUTES } from '../routes.js'
import styles from './BottomNav.module.css'

/**
 * 기본 탭 구성. 5개 중 타임캡슐/아카이브만 이 저장소 담당입니다.
 *
 * 합병 시 주의: 하단 내비는 3명이 공유하는 유일한 컴포넌트라 가장 충돌하기 쉽습니다.
 * 각자 BottomNav를 만들면 하나만 살아남고 나머지 화면은 내비와 안 맞게 됩니다.
 * 셸 담당자가 이 배열을 소유하고, 나머지는 items/availableRoutes prop 으로 주입받는 형태를 권합니다.
 */
export const DEFAULT_NAV_ITEMS = [
  { route: ROUTES.home, label: '홈', icon: Home },
  { route: ROUTES.friends, label: '친구', icon: UsersRound },
  { route: ROUTES.capsule, label: '타임캡슐', icon: Timer },
  { route: ROUTES.archive, label: '아카이브', icon: Archive },
  { route: ROUTES.my, label: '마이', icon: UserRound },
]

/**
 * @param {object}   props
 * @param {string}   props.currentRoute      현재 활성 라우트 (ROUTES 값)
 * @param {Function} [props.onNavigate]      (route) => void
 * @param {Array}    [props.items]           탭 구성. 기본값 DEFAULT_NAV_ITEMS
 * @param {string[]} [props.availableRoutes] 실제로 이동 가능한 라우트. 나머지는 비활성 처리됩니다.
 *                                           팀원 화면이 붙으면 셸 담당자가 전체 목록을 넘기세요.
 */
export function BottomNav({ currentRoute, onNavigate, items = DEFAULT_NAV_ITEMS, availableRoutes = OWNED_ROUTES }) {
  return (
    <nav className={styles.nav} aria-label="주요 메뉴">
      {items.map(({ route, label, icon: Icon }) => {
        const active = route === currentRoute
        const available = availableRoutes.includes(route)
        return (
          <button
            key={route}
            type="button"
            className={active ? `${styles.item} ${styles.active}` : styles.item}
            aria-current={active ? 'page' : undefined}
            // 아직 화면이 없는 탭. 클릭해도 아무 일이 없다는 사실을 스크린리더에도 알립니다.
            aria-disabled={available ? undefined : 'true'}
            onClick={() => {
              if (available) onNavigate?.(route)
            }}
          >
            <Icon size={22} strokeWidth={active ? 2.3 : 1.8} aria-hidden="true" />
            <span>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
