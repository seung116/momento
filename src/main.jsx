import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Archive, ChevronDown, Home, ListFilter, Menu, Plus, Search, Timer, UserRound, UsersRound } from 'lucide-react'
import './styles.css'

const capsules = [
  { year: 2026, state: '개봉 가능', dday: 'D-DAY', title: '2024 우리, 다시 만나는 날', desc: '1년 동안 서로에게 응원과 사랑을 보냈던 우리의 소중한 타임캡슐', date: '2027년 3월 1일 개봉', members: 4, action: '열어보기' },
  { year: 2026, state: '작성 중', dday: 'D-365', title: '20살의 우리에게', desc: '스무 살의 마지막 날, 서로에게 보내는 편지', date: '2027년 12월 31일 개봉', members: 3, action: '작성하기' },
  { year: 2025, state: '봉인됨', dday: 'D-91', title: '졸업하는 우리에게', desc: '함께한 대학 생활을 기억하며 남긴 이야기', date: '2026년 12월 15일 개봉', members: 5, action: '상세보기' },
]

const archives = [
  { year: 2026, title: '1년 후의 나에게', date: '2027년 3월 1일', author: '유빈', elapsed: 'D+30' },
  { year: 2026, title: '여름 바다에서의 하루', date: '2026년 8월 14일', author: '유빈', elapsed: 'D+21' },
  { year: 2025, title: '우리의 첫 여행', date: '2025년 12월 24일', author: '민준', elapsed: 'D+265' },
]

function IconButton({ label, children, onClick }) {
  return <button className="icon-button" aria-label={label} onClick={onClick}>{children}</button>
}

function BottomNav({ page, setPage }) {
  const items = [
    ['홈', Home], ['친구', UsersRound], ['타임캡슐', Timer, 'capsule'], ['아카이브', Archive, 'archive'], ['마이', UserRound],
  ]
  return <nav className="bottom-nav">{items.map(([label, Icon, target]) => {
    const active = target === page
    return <button key={label} className={active ? 'active' : ''} onClick={() => target && setPage(target)}><Icon size={22} strokeWidth={active ? 2.3 : 1.8}/><span>{label}</span></button>
  })}</nav>
}

function AppHeader({ title }) {
  return <header className="app-header"><strong>{title}</strong></header>
}

function YearToolbar({ onSearch, filter = false, compact, setCompact }) {
  return <div className="toolbar">
    <button className="year-button">전체 <ChevronDown size={22}/></button>
    <div className="toolbar-actions">
      {filter && <IconButton label="필터"><ListFilter size={19}/></IconButton>}
      <IconButton label="검색" onClick={onSearch}><Search size={19}/></IconButton>
      {!filter && <div className="view-toggle"><button className={!compact ? 'selected' : ''} onClick={() => setCompact(false)}><Menu size={19}/></button><button className={compact ? 'selected' : ''} onClick={() => setCompact(true)}><Menu size={19}/></button></div>}
    </div>
  </div>
}

function CapsuleCard({ item, compact }) {
  return <article className={`capsule-card ${compact ? 'compact' : ''}`}>
    <div className="card-copy">
      <div className="badges"><span className={`state ${item.state.replaceAll(' ','')}`}>{item.state}</span><span className="dday">{item.dday}</span></div>
      <h3>{item.title}</h3>{!compact && <p>{item.desc}</p>}<small>{item.date}</small>
    </div>
    <div className="card-side"><span className="people">{Array.from({length: Math.min(item.members,3)},(_,i)=><i key={i}>{i+1}</i>)}{item.members > 3 && <b>+{item.members-3}</b>}</span><button>{item.action}</button></div>
  </article>
}

function SearchSheet({ onClose, title }) {
  return <div className="sheet-backdrop" onClick={onClose}><section className="search-sheet" onClick={e=>e.stopPropagation()}><div className="sheet-handle"/><h2>{title} 검색</h2><label><Search size={19}/><input autoFocus placeholder="제목이나 내용을 검색해보세요"/></label><button className="close-sheet" onClick={onClose}>닫기</button></section></div>
}

function CapsulePage({ setPage }) {
  const [tab,setTab]=useState('전체'); const [compact,setCompact]=useState(false); const [search,setSearch]=useState(false)
  const list=useMemo(()=>capsules.filter(x=>tab==='전체'||x.state===tab),[tab])
  return <div className="phone"><AppHeader title="타임캡슐"/><main>
    <div className="segmented">{['전체','작성 중','봉인됨','개봉 가능'].map(x=><button key={x} className={tab===x?'selected':''} onClick={()=>setTab(x)}>{x}</button>)}</div>
    <YearToolbar onSearch={()=>setSearch(true)} compact={compact} setCompact={setCompact}/>
    {[2026,2025].map(year=>{const rows=list.filter(x=>x.year===year); return rows.length?<section className="year-group" key={year}><p>{year}년</p>{rows.map(x=><CapsuleCard item={x} compact={compact} key={x.title}/>)}</section>:null})}
  </main><button className="fab" aria-label="캡슐 만들기"><Plus/></button><BottomNav page="capsule" setPage={setPage}/>{search&&<SearchSheet title="타임캡슐" onClose={()=>setSearch(false)}/>}</div>
}

function ArchivePage({ setPage }) {
  const [search,setSearch]=useState(false)
  return <div className="phone"><AppHeader title="아카이브"/><main>
    <div className="greeting"><strong>유빈님,</strong><span>오늘의 추억을 저장해보세요</span></div>
    <YearToolbar filter onSearch={()=>setSearch(true)}/>
    {[2026,2025].map(year=><section className="year-group archive-group" key={year}><p>{year}년</p>{archives.filter(x=>x.year===year).map(x=><article className="archive-card" key={x.title}><div><span className="elapsed">{x.elapsed}</span><h3>{x.title}</h3><small>{x.date}</small></div><em>{x.author}</em></article>)}</section>)}
  </main><button className="fab" aria-label="아카이브 작성"><Plus/></button><BottomNav page="archive" setPage={setPage}/>{search&&<SearchSheet title="아카이브" onClose={()=>setSearch(false)}/>}</div>
}

function App(){const [page,setPage]=useState('capsule'); return page==='capsule'?<CapsulePage setPage={setPage}/>:<ArchivePage setPage={setPage}/>}

createRoot(document.getElementById('root')).render(<App />)
