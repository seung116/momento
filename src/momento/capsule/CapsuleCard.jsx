import styles from './capsule.module.css'

/**
 * 상태 라벨 -> CSS Modules 클래스 매핑.
 * 예전 코드는 `item.state.replaceAll(' ','')` 로 한글 클래스명을 즉석 생성했는데,
 * 데이터에 오타나 공백 변화가 생기면 스타일이 조용히 사라지고
 * replaceAll 은 구형 모바일 Safari(13.4 이하)에 없습니다.
 */
const STATE_STYLE = {
  '개봉 가능': styles.stateOpenable,
  '작성 중': styles.stateWriting,
  봉인됨: styles.stateSealed,
}

function MemberAvatars({ count }) {
  // 문자열/undefined/음수가 들어와도 렌더가 깨지지 않도록 정규화합니다.
  const total = Number.isFinite(count) ? Math.max(0, Math.trunc(count)) : 0
  const shown = Math.min(total, 3)
  return (
    <span className={styles.people} aria-label={`참여자 ${total}명`}>
      {Array.from({ length: shown }, (_, i) => (
        <i key={i} aria-hidden="true">
          {i + 1}
        </i>
      ))}
      {total > 3 && <b aria-hidden="true">+{total - 3}</b>}
    </span>
  )
}

export function CapsuleCard({ item, compact = false, onAction }) {
  return (
    <article className={compact ? `${styles.card} ${styles.compact}` : styles.card}>
      <div className={styles.copy}>
        <div className={styles.badges}>
          <span className={`${styles.badge} ${STATE_STYLE[item.state] ?? styles.stateSealed}`}>{item.state}</span>
          <span className={`${styles.badge} ${styles.dday}`}>{item.dday}</span>
        </div>
        <h3>{item.title}</h3>
        {!compact && <p>{item.desc}</p>}
        <small>{item.date}</small>
      </div>
      <div className={styles.side}>
        <MemberAvatars count={item.members} />
        <button type="button" onClick={() => onAction?.(item)}>
          {item.action}
        </button>
      </div>
    </article>
  )
}
