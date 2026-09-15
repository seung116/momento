import { Plus } from 'lucide-react'
import styles from './Fab.module.css'

/** 셸의 fab 슬롯에 넣는 플로팅 버튼. PhoneShell.frame 기준으로 배치됩니다. */
export function Fab({ label, onClick }) {
  return (
    <button type="button" className={styles.fab} aria-label={label} onClick={onClick}>
      <Plus aria-hidden="true" />
    </button>
  )
}
