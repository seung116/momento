import { useCallback, useRef } from 'react'
import { Check } from 'lucide-react'
import { BottomSheet } from '../ui/BottomSheet.jsx'
import styles from './YearFilterSheet.module.css'

export const ALL_YEARS = 'all'

/** 상단 연도 버튼에 표시할 라벨. 전체일 때는 '전체', 연도 선택 시 '2026년'. */
export function yearButtonLabel(selectedYear) {
  return selectedYear === ALL_YEARS ? '전체' : `${selectedYear}년`
}

/**
 * 아카이브 연도 선택 바텀시트. Figma BottomSheet / 5837:6073
 *
 * 연도 목록은 하드코딩하지 않고 호출부에서 데이터로부터 만들어 넘깁니다.
 *
 * @param {object}   props
 * @param {boolean}  props.open
 * @param {Function} props.onClose        안정된 참조를 넘기세요 (useCallback)
 * @param {number[]} props.years          내림차순 연도 목록
 * @param {number|'all'} props.selected
 * @param {Function} props.onSelect       (year|'all') => void
 */
export function YearFilterSheet({ open, onClose, years, selected, onSelect }) {
  const options = [{ value: ALL_YEARS, label: '전체 기간' }, ...years.map((y) => ({ value: y, label: `${y}년` }))]
  const groupRef = useRef(null)

  /*
    열릴 때 현재 선택된 항목으로 포커스를 옮깁니다. (라디오 그룹의 표준 동작)

    useEffect([open]) 로는 동작하지 않습니다. open 이 true 로 바뀌는 렌더에서 BottomSheet 는
    아직 null 을 반환하므로 radiogroup 노드가 존재하지 않고, effect 는 그 뒤로 다시 실행되지 않습니다.
    콜백 ref 를 쓰면 노드가 실제로 붙는 시점에 정확히 한 번 실행됩니다.
    (BottomSheet 는 열려 있을 때만 children 을 렌더하므로 노드 부착 = 열림)
  */
  const attachGroup = useCallback((node) => {
    groupRef.current = node
    if (!node) return
    requestAnimationFrame(() => {
      // preventScroll: 진입 트랜지션 중(시트가 화면 밖에 있을 때) 포커스가
      // 프레임을 스크롤해 레이아웃을 밀어내는 것을 막습니다.
      node.querySelector('[aria-checked="true"]')?.focus({ preventScroll: true })
    })
  }, [])

  /*
    화살표는 "포커스만" 옮기고 확정은 Enter/Space(=click)로 합니다.
    일반 라디오 그룹처럼 화살표가 곧 선택이 되면, 선택 시 시트가 닫히는 이 화면에서는
    아래 방향키 한 번에 시트가 닫혀 키보드로 목록을 훑을 수 없습니다.
  */
  const onKeyDown = (event) => {
    const delta = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key]
    if (!delta && event.key !== 'Home' && event.key !== 'End') return

    const radios = [...(groupRef.current?.querySelectorAll('[role="radio"]') ?? [])]
    if (radios.length === 0) return

    event.preventDefault()
    const current = radios.indexOf(document.activeElement)
    let next
    if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = radios.length - 1
    else next = (Math.max(current, 0) + delta + radios.length) % radios.length
    radios[next].focus()
  }

  return (
    <BottomSheet open={open} onClose={onClose} label="기간 선택" className={styles.sheet}>
      <div className={styles.body}>
        <h2 className={styles.title}>언제 저장한 추억을 볼까요</h2>
        <div
          className={styles.options}
          role="radiogroup"
          aria-label="기간 선택"
          ref={attachGroup}
          onKeyDown={onKeyDown}
        >
          {options.map((option) => {
            const checked = option.value === selected
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={checked}
                // 로빙 tabindex: 그룹 전체가 Tab 한 번으로 지나가도록 선택된 항목만 tabbable
                tabIndex={checked ? 0 : -1}
                className={styles.option}
                onClick={() => onSelect(option.value)}
              >
                <span>{option.label}</span>
                <span className={styles.check}>
                  {checked && <Check size={24} strokeWidth={2} aria-hidden="true" />}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </BottomSheet>
  )
}
