import styles from './archive.module.css'

export function ArchiveCard({ item, onClick }) {
  return (
    <article className={styles.card} onClick={onClick ? () => onClick(item) : undefined}>
      <div>
        <span className={styles.elapsed}>{item.elapsed}</span>
        <h3>{item.title}</h3>
        <small>{item.date}</small>
      </div>
      <em className={styles.author}>{item.author}</em>
    </article>
  )
}
