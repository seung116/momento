/**
 * 아카이브 목업 데이터.
 *
 * 합병 시: ArchiveScreen 의 items prop 으로 같은 형태의 배열을 넘기면 이 파일은 지워도 됩니다.
 */

/**
 * @typedef {object} ArchiveEntry
 * @property {string} id      React key. 제목이 중복되어도 안전하도록 필수입니다.
 * @property {number} year    연도 그룹 기준
 * @property {string} title
 * @property {string} date    표시용 문자열
 * @property {string} author
 * @property {string} elapsed D+30 등 표시용 문자열
 */

/** @type {ArchiveEntry[]} */
export const archives = [
  { id: 'archive-1', year: 2026, title: '1년 후의 나에게', date: '2027년 3월 1일', author: '유빈', elapsed: 'D+30' },
  {
    id: 'archive-2',
    year: 2026,
    title: '여름 바다에서의 하루',
    date: '2026년 8월 14일',
    author: '유빈',
    elapsed: 'D+21',
  },
  { id: 'archive-3', year: 2025, title: '우리의 첫 여행', date: '2025년 12월 24일', author: '민준', elapsed: 'D+265' },
]
