import styles from './YearSection.module.css'

/** 연도 라벨 + 그 해 항목들. */
export function YearSection({ year, children }) {
  return (
    <section className={styles.group}>
      <p>{year}년</p>
      {children}
    </section>
  )
}

export function EmptyState({ children }) {
  return <p className={styles.empty}>{children}</p>
}
