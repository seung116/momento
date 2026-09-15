import { useCallback, useEffect, useRef, useState } from 'react'
import { useShellScrollRef } from '../shell/ShellScrollContext.js'
import styles from './BottomSheet.module.css'

const EXIT_MS = 200

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
}

/**
 * 공통 바텀시트. 오버레이 / 애니메이션 / 배경 스크롤 잠금 / ESC / 포커스 처리를 담당하고
 * 내용은 children 으로 받습니다.
 *
 * 조건부 렌더(`open && <Sheet/>`) 대신 open prop 을 받습니다.
 * 닫힘 애니메이션을 끝까지 보여준 뒤 언마운트해야 하기 때문입니다.
 *
 * PhoneShell 의 overlay 슬롯에 넣어야 프레임 기준으로 배치됩니다.
 *
 * @param {object}    props
 * @param {boolean}   props.open
 * @param {Function}  props.onClose      안정된 참조를 넘기세요 (useCallback)
 * @param {string}    props.label        aria-label. 시트의 접근성 이름
 * @param {string}    [props.className]  시트 요소에 덧붙일 클래스. 커스텀 프로퍼티 override 용
 * @param {boolean}   [props.showHandle] 상단 grabber 표시 여부 (기본 true)
 * @param {ReactNode} props.children
 */
export function BottomSheet({ open, onClose, label, className, showHandle = true, children }) {
  const [rendered, setRendered] = useState(false) // DOM 에 존재하는지
  const [shown, setShown] = useState(false) // 올라온 상태인지 (트랜지션 목표 지점)
  const renderedRef = useRef(false)
  const sheetRef = useRef(null)
  const scrollRef = useShellScrollRef()
  // 열기 직전 포커스를 기억해 닫을 때 되돌립니다. (보통 트리거 버튼으로 복귀)
  const restoreFocusRef = useRef(null)

  useEffect(() => {
    if (open) {
      restoreFocusRef.current = document.activeElement
      renderedRef.current = true
      setRendered(true)
      // 다음 프레임에 shown 으로 바꿔야 transform 트랜지션이 실제로 재생됩니다.
      const raf = requestAnimationFrame(() => setShown(true))
      return () => cancelAnimationFrame(raf)
    }

    setShown(false)
    if (!renderedRef.current) return
    const timer = setTimeout(
      () => {
        renderedRef.current = false
        setRendered(false)
      },
      prefersReducedMotion() ? 0 : EXIT_MS,
    )
    return () => clearTimeout(timer)
  }, [open])

  // 완전히 닫힌 뒤 원래 포커스 복구
  useEffect(() => {
    if (rendered) return
    const node = restoreFocusRef.current
    restoreFocusRef.current = null
    if (node && typeof node.focus === 'function' && document.contains(node)) node.focus()
  }, [rendered])

  // ESC 로 닫기
  useEffect(() => {
    if (!rendered) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [rendered, onClose])

  /*
    배경 스크롤 잠금.
    이 앱은 body 가 아니라 셸의 <main> 이 스크롤하므로 그 요소를 잠급니다.
    overflow 를 hidden 으로 바꾸면 스크롤바가 사라져 내용 폭이 튀는 브라우저가 있어
    사라진 스크롤바 폭만큼 padding-right 로 보정하고, 닫을 때 원래 값으로 되돌립니다.
  */
  useEffect(() => {
    if (!rendered) return
    const node = scrollRef?.current ?? document.body
    const gap = node.offsetWidth - node.clientWidth
    const prevOverflow = node.style.overflow
    const prevPaddingRight = node.style.paddingRight
    const basePaddingRight = parseFloat(getComputedStyle(node).paddingRight) || 0

    node.style.overflow = 'hidden'
    if (gap > 0) node.style.paddingRight = `${basePaddingRight + gap}px`

    return () => {
      node.style.overflow = prevOverflow
      node.style.paddingRight = prevPaddingRight
    }
  }, [rendered, scrollRef])

  // 최소 포커스 트랩. aria-modal 을 선언했으므로 Tab 이 시트를 벗어나지 않게 합니다.
  const onKeyDownTrap = useCallback((event) => {
    if (event.key !== 'Tab') return
    const focusables = sheetRef.current?.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    if (!focusables?.length) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }, [])

  if (!rendered) return null

  return (
    <div className={shown ? `${styles.backdrop} ${styles.entered}` : styles.backdrop} onClick={onClose}>
      <section
        ref={sheetRef}
        className={className ? `${styles.sheet} ${className}` : styles.sheet}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(event) => event.stopPropagation()}
        onKeyDown={onKeyDownTrap}
      >
        {showHandle && (
          <button type="button" className={styles.handleHit} aria-label="닫기" onClick={onClose}>
            <span className={styles.handle} />
          </button>
        )}
        {children}
      </section>
    </div>
  )
}
