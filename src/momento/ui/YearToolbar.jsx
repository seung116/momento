import { ChevronDown, ListFilter, Menu, Search } from 'lucide-react'
import styles from './YearToolbar.module.css'

/** YearToolbar 전용 아이콘 버튼. 외부로 내보내지 않는 구현 세부입니다. */
function IconButton({ label, pressed, onClick, children }) {
  return (
    <button type="button" className={styles.iconButton} aria-label={label} aria-pressed={pressed} onClick={onClick}>
      {children}
    </button>
  )
}

/**
 * 연도 선택 + 검색/필터/보기전환 툴바.
 *
 * compact / onCompactChange 에 기본값을 둡니다.
 * 아카이브 화면은 <YearToolbar filter /> 로만 호출해서 이 두 값을 넘기지 않는데,
 * 기본값이 없으면 filter 조건이 조금만 바뀌어도 `is not a function` 런타임 에러가 납니다.
 */
export function YearToolbar({
  onSearch,
  searching = false,
  filter = false,
  compact = false,
  onCompactChange = () => {},
  onFilter,
  // 연도 버튼. onYearClick 을 넘기지 않으면 기존처럼 '전체' 라벨의 비활성 버튼입니다.
  yearLabel = '전체',
  onYearClick,
  yearSheetOpen = false,
}) {
  return (
    <div className={styles.toolbar}>
      <button
        type="button"
        className={styles.yearButton}
        onClick={onYearClick}
        aria-haspopup={onYearClick ? 'dialog' : undefined}
        aria-expanded={onYearClick ? yearSheetOpen : undefined}
      >
        {yearLabel} <ChevronDown size={22} aria-hidden="true" />
      </button>
      <div className={styles.actions}>
        {filter && (
          <IconButton label="필터" onClick={onFilter}>
            <ListFilter size={19} aria-hidden="true" />
          </IconButton>
        )}
        <IconButton label="검색" pressed={searching} onClick={onSearch}>
          <Search size={19} aria-hidden="true" />
        </IconButton>
        {!filter && (
          <div className={styles.viewToggle} role="group" aria-label="목록 보기 방식">
            <button
              type="button"
              aria-label="자세히 보기"
              aria-pressed={!compact}
              className={compact ? undefined : styles.toggleSelected}
              onClick={() => onCompactChange(false)}
            >
              <Menu size={19} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="간략히 보기"
              aria-pressed={compact}
              className={compact ? styles.toggleSelected : undefined}
              onClick={() => onCompactChange(true)}
            >
              <Menu size={19} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
