import { useCallback, useMemo, useState } from 'react'
import { PhoneShell } from '../shell/PhoneShell.jsx'
import { BottomNav } from '../shell/BottomNav.jsx'
import { Fab } from '../ui/Fab.jsx'
import { SearchSheet } from '../ui/SearchSheet.jsx'
import { YearToolbar } from '../ui/YearToolbar.jsx'
import { EmptyState, YearSection } from '../ui/YearSection.jsx'
import { groupByYear, matchesQuery, yearsOf } from '../lib/list.js'
import { ROUTES } from '../routes.js'
import { archives as defaultArchives } from './archiveData.js'
import { ArchiveCard } from './ArchiveCard.jsx'
import { ALL_YEARS, YearFilterSheet, yearButtonLabel } from './YearFilterSheet.jsx'
import styles from './archive.module.css'

/**
 * 아카이브 화면.
 *
 * @param {object}   props
 * @param {Array}    [props.items]      아카이브 목록. 기본값은 목업.
 * @param {string}   [props.userName]   인사말에 쓰이는 이름. 호스트의 로그인 정보를 넘기세요.
 * @param {Function} [props.onNavigate] (route) => void
 * @param {Array}    [props.navItems]
 * @param {string[]} [props.availableRoutes]
 * @param {Function} [props.onCreate]
 * @param {Function} [props.onSelectEntry]
 * @param {'viewport'|'parent'} [props.fill]
 */
export function ArchiveScreen({
  items = defaultArchives,
  userName = '유빈',
  onNavigate,
  navItems,
  availableRoutes,
  onCreate,
  onSelectEntry,
  fill,
}) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  // 연도 필터 상태는 이 화면이 소유합니다.
  const [selectedYear, setSelectedYear] = useState(ALL_YEARS)
  const [yearSheetOpen, setYearSheetOpen] = useState(false)

  const closeSearch = useCallback(() => setSearchOpen(false), [])
  const closeYearSheet = useCallback(() => setYearSheetOpen(false), [])

  // 시트에 보여줄 연도 목록. 데이터에서 중복 제거 후 최신순. (검색어와 무관하게 전체 기준)
  const years = useMemo(() => yearsOf(items), [items])

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = items.filter(
      (item) => (selectedYear === ALL_YEARS || item.year === selectedYear) && matchesQuery(item, q),
    )
    return groupByYear(filtered)
  }, [items, query, selectedYear])

  // 연도를 고르면 시트를 닫습니다.
  const selectYear = useCallback((value) => {
    setSelectedYear(value)
    setYearSheetOpen(false)
  }, [])

  return (
    <PhoneShell
      title="아카이브"
      fill={fill}
      fab={<Fab label="아카이브 작성" onClick={onCreate} />}
      nav={
        <BottomNav
          currentRoute={ROUTES.archive}
          onNavigate={onNavigate}
          items={navItems}
          availableRoutes={availableRoutes}
        />
      }
      overlay={
        <>
          <SearchSheet
            open={searchOpen}
            title="아카이브"
            query={query}
            onQueryChange={setQuery}
            onClose={closeSearch}
          />
          <YearFilterSheet
            open={yearSheetOpen}
            onClose={closeYearSheet}
            years={years}
            selected={selectedYear}
            onSelect={selectYear}
          />
        </>
      }
    >
      <div className={styles.greeting}>
        <strong>{userName}님,</strong>
        <span>오늘의 추억을 저장해보세요</span>
      </div>

      <YearToolbar
        filter
        onSearch={() => setSearchOpen(true)}
        searching={searchOpen}
        yearLabel={yearButtonLabel(selectedYear)}
        onYearClick={() => setYearSheetOpen(true)}
        yearSheetOpen={yearSheetOpen}
      />

      {groups.length === 0 ? (
        <EmptyState>검색 결과가 없어요.</EmptyState>
      ) : (
        groups.map(({ year, rows }) => (
          <YearSection year={year} key={year}>
            {rows.map((item) => (
              <ArchiveCard item={item} onClick={onSelectEntry} key={item.id} />
            ))}
          </YearSection>
        ))
      )}
    </PhoneShell>
  )
}
