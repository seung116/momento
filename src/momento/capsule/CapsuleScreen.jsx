import { useCallback, useMemo, useState } from 'react'
import { PhoneShell } from '../shell/PhoneShell.jsx'
import { BottomNav } from '../shell/BottomNav.jsx'
import { Fab } from '../ui/Fab.jsx'
import { SearchSheet } from '../ui/SearchSheet.jsx'
import { YearToolbar } from '../ui/YearToolbar.jsx'
import { EmptyState, YearSection } from '../ui/YearSection.jsx'
import { groupByYear, matchesQuery } from '../lib/list.js'
import { ROUTES } from '../routes.js'
import { ALL_TAB, CAPSULE_TABS, capsules as defaultCapsules } from './capsuleData.js'
import { CapsuleCard } from './CapsuleCard.jsx'
import styles from './capsule.module.css'

/**
 * 타임캡슐 화면.
 *
 * 라우팅을 소유하지 않습니다. onNavigate 콜백만 호출하므로
 * 호스트가 react-router 든 자체 상태든 자유롭게 붙일 수 있습니다.
 *
 * @param {object}   props
 * @param {Array}    [props.items]        캡슐 목록. 기본값은 목업. 호스트는 API 결과를 넘기세요.
 * @param {Function} [props.onNavigate]   (route) => void
 * @param {Array}    [props.navItems]     하단 내비 구성 (셸 담당자 소유)
 * @param {string[]} [props.availableRoutes] 이동 가능한 라우트
 * @param {Function} [props.onCreate]     캡슐 만들기
 * @param {Function} [props.onSelectCapsule] (capsule) => void
 * @param {'viewport'|'parent'} [props.fill] 셸 높이 기준
 */
export function CapsuleScreen({
  items = defaultCapsules,
  onNavigate,
  navItems,
  availableRoutes,
  onCreate,
  onSelectCapsule,
  fill,
}) {
  const [tab, setTab] = useState(ALL_TAB)
  const [compact, setCompact] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')

  // SearchSheet의 키 리스너가 매 렌더마다 재등록되지 않도록 안정된 참조를 넘깁니다.
  const closeSearch = useCallback(() => setSearchOpen(false), [])

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = items.filter((item) => (tab === ALL_TAB || item.state === tab) && matchesQuery(item, q))
    return groupByYear(filtered)
  }, [items, tab, query])

  return (
    <PhoneShell
      title="타임캡슐"
      fill={fill}
      fab={<Fab label="캡슐 만들기" onClick={onCreate} />}
      nav={
        <BottomNav
          currentRoute={ROUTES.capsule}
          onNavigate={onNavigate}
          items={navItems}
          availableRoutes={availableRoutes}
        />
      }
      overlay={
        <SearchSheet open={searchOpen} title="타임캡슐" query={query} onQueryChange={setQuery} onClose={closeSearch} />
      }
    >
      <div className={styles.tabs} role="group" aria-label="상태별 필터">
        {CAPSULE_TABS.map((label) => (
          <button
            key={label}
            type="button"
            aria-pressed={tab === label}
            className={tab === label ? styles.tabSelected : undefined}
            onClick={() => setTab(label)}
          >
            {label}
          </button>
        ))}
      </div>

      <YearToolbar
        onSearch={() => setSearchOpen(true)}
        searching={searchOpen}
        compact={compact}
        onCompactChange={setCompact}
      />

      {groups.length === 0 ? (
        <EmptyState>조건에 맞는 타임캡슐이 없어요.</EmptyState>
      ) : (
        groups.map(({ year, rows }) => (
          <YearSection year={year} key={year}>
            {rows.map((item) => (
              <CapsuleCard item={item} compact={compact} onAction={onSelectCapsule} key={item.id} />
            ))}
          </YearSection>
        ))
      )}
    </PhoneShell>
  )
}
