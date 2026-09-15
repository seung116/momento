import { Search } from 'lucide-react'
import { BottomSheet } from './BottomSheet.jsx'
import styles from './SearchSheet.module.css'

/**
 * 하단 검색 시트. 공통 BottomSheet 위에 검색 내용만 얹습니다.
 * (오버레이 / 애니메이션 / 스크롤 잠금 / ESC / 포커스 복구는 BottomSheet 담당)
 *
 * @param {object}   props
 * @param {boolean}  props.open
 * @param {string}   props.title           "{title} 검색" 으로 표시됩니다
 * @param {string}   props.query
 * @param {Function} props.onQueryChange   (value) => void
 * @param {Function} props.onClose         안정된 참조를 넘기세요 (useCallback)
 */
export function SearchSheet({ open, title, query, onQueryChange, onClose }) {
  return (
    <BottomSheet open={open} onClose={onClose} label={`${title} 검색`} className={styles.sheet}>
      <h2>{title} 검색</h2>
      {/* form으로 감싸 Enter 제출 시 페이지가 새로고침되는 것을 막습니다. */}
      <form onSubmit={(event) => event.preventDefault()}>
        <label className={styles.field}>
          <Search size={19} aria-hidden="true" />
          <span className={styles.srOnly}>{title} 검색어</span>
          {/*
            autoFocus는 의도적으로 넣지 않았습니다. 모바일에서 시트가 열리는 순간 키보드가 올라오며
            레이아웃이 튀고, iOS에서는 하단 시트가 키보드 뒤로 가려집니다.
          */}
          <input
            type="search"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="제목이나 내용을 검색해보세요"
            enterKeyHint="search"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </label>
      </form>
      <button type="button" className={styles.close} onClick={onClose}>
        닫기
      </button>
    </BottomSheet>
  )
}
