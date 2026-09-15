/** 연도 목록을 데이터에서 파생시킵니다. (연도를 하드코딩하면 다른 연도 항목이 조용히 사라집니다) */
export function yearsOf(rows) {
  return [...new Set(rows.map((row) => row.year))].sort((a, b) => b - a)
}

/** 소문자로 정규화된 검색어와 비교합니다. query는 호출부에서 trim + toLowerCase 하세요. */
export function matchesQuery(row, query) {
  if (!query) return true
  const haystack = [row.title, row.desc, row.author].filter(Boolean).join(' ').toLowerCase()
  return haystack.includes(query)
}

/** 연도별로 묶은 [{ year, rows }] 배열. 화면 두 곳에서 같은 로직을 쓰므로 공용화했습니다. */
export function groupByYear(rows) {
  return yearsOf(rows).map((year) => ({ year, rows: rows.filter((row) => row.year === year) }))
}
