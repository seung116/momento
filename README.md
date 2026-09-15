# Momento — 타임캡슐 / 아카이브

3인 협업 프로젝트에서 **타임캡슐**과 **아카이브** 화면을 담당하는 저장소입니다.
이 저장소는 코드 보관용이고, 최종적으로는 팀원의 저장소에 합칩니다.
그래서 담당 화면 전체가 `src/momento/` 폴더 하나로 떼어낼 수 있게 구성돼 있습니다.

기준 디자인 사이즈는 **393 × 852** (iPhone 15/16)이고, 기기 폭/높이에 따라 유동 대응합니다.

```bash
npm install
npm run dev          # localhost 만 바인딩
npm run dev:host     # 실기기 테스트용 (LAN 노출됨, 신뢰할 수 있는 네트워크에서만)
npm run build
npm run format       # 커밋 전 실행 권장
```

---

## 폴더 구조

| 경로                                                | 합병 시          | 설명                                                     |
| --------------------------------------------------- | ---------------- | -------------------------------------------------------- |
| `src/momento/`                                      | **가져감**       | 담당 화면 전부. 이 폴더만 복사하면 됩니다                |
| `src/main.jsx`                                      | 버림             | `createRoot` 진입점. 호스트에 이미 있음                  |
| `src/standalone/`                                   | 버림             | 단독 실행용 껍데기 + 전역 리셋                           |
| `index.html`                                        | 버림 (일부 발췌) | → [옮겨야 하는 것](#indexhtml에서-반드시-옮겨야-하는-것) |
| `vite.config.js` `package.json` `package-lock.json` | 버림             | 호스트 설정 사용                                         |
| `.editorconfig` `.prettierrc` `.gitattributes`      | 팀 합의 후       | 포매팅 충돌 방지                                         |

```
src/momento/
  index.js            공개 API (여기서만 import 하세요)
  routes.js           라우트 키 상수 — 3명이 공유해야 하는 유일한 값
  momento.css         디자인 토큰 + .momento-root 하위로 스코프된 리셋
  lib/list.js         연도 그룹화 / 검색 필터
  shell/              PhoneShell(393x852 셸), BottomNav
  ui/                 Fab, YearToolbar, SearchSheet, YearSection/EmptyState
  capsule/            CapsuleScreen, CapsuleCard, capsuleData
  archive/            ArchiveScreen, ArchiveCard, archiveData
```

`src/momento/` 안의 코드는 다음을 **하지 않습니다.** 그래서 호스트와 충돌하지 않습니다.

- `createRoot` / ReactDOM 마운트
- 전역 리셋(`body`, `#root`, `*` 등) 정의
- 라우터 소유 (`onNavigate` 콜백만 호출)
- `index.html` 수정

---

## 사용법

```jsx
import { CapsuleScreen, ArchiveScreen, ROUTES } from './momento'

// 가장 단순한 형태 (목업 데이터 사용)
<CapsuleScreen onNavigate={(route) => navigate(`/${route}`)} />

// 실제 데이터 + 전체 탭 활성화
<CapsuleScreen
  items={capsulesFromApi}
  onNavigate={navigate}
  availableRoutes={Object.values(ROUTES)}   // 팀원 화면이 다 붙은 뒤
  onCreate={() => openCreateModal()}
  onSelectCapsule={(capsule) => navigate(`/capsule/${capsule.id}`)}
/>

<ArchiveScreen items={entriesFromApi} userName={user.name} onNavigate={navigate} />
```

호스트가 이미 자체 프레임/레이아웃을 갖고 있으면 `fill="parent"`를 넘기세요.
(기본값 `viewport`는 `100dvh`를 직접 차지합니다)

---

## 다른 저장소에 합치는 절차

히스토리가 서로 무관하므로 `git merge`는 쓰지 마세요.
`--allow-unrelated-histories`를 쓰면 `package-lock.json`과 설정 파일이 전부 충돌합니다.
**필요한 폴더만 체크아웃**하는 방식이 훨씬 안전합니다.

```bash
# 1. 팀 저장소를 remote로 추가
git remote add team https://github.com/<팀원>/<저장소>.git
git fetch team

# 2. 팀 main 위에 작업 브랜치 생성 (main 직접 푸시 금지)
git checkout -b feat/capsule-archive team/main

# 3. 이 저장소 main에서 담당 폴더만 가져오기
git checkout main -- src/momento

# 4. 포매팅 설정은 팀 합의 후에만
# git checkout main -- .editorconfig .prettierrc .gitattributes

# 5. 의존성 추가 (팀 저장소에 없으면)
npm install lucide-react@1.46.0

git add src/momento
git commit -m "feat: 타임캡슐/아카이브 화면 추가"
git push -u team feat/capsule-archive
```

그다음 PR을 올리고, 아래 두 가지를 리뷰에서 확인해 달라고 요청하세요.

1. `index.html`에 viewport meta / 폰트 link가 들어갔는지
2. 하단 내비를 누가 소유할지 (아래 참고)

### index.html에서 반드시 옮겨야 하는 것

```html
<meta charset="UTF-8" />
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content"
/>
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin />
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/pretendard@1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
/>
```

- **viewport meta가 빠지면 모바일이 980px 가상 뷰포트로 렌더 후 축소합니다.** 가장 치명적입니다.
- `viewport-fit=cover`가 없으면 노치/홈 인디케이터 보정(`env(safe-area-inset-*)`)이 동작하지 않습니다.
- 폰트가 없으면 시스템 폰트로 폴백돼 디자인이 달라 보입니다. (레이아웃은 깨지지 않습니다)
- 확대 차단(`maximum-scale`, `user-scalable=no`)은 접근성 때문에 넣지 않았습니다.

### 요구 사항

- `react` >= 18 (개발은 19.3.0)
- `lucide-react` ^1 — **0.x와 API가 다릅니다.** 팀원이 0.x를 쓰면 버전을 맞춰야 합니다
- CSS Modules (`*.module.css`) — Vite / Next / CRA 모두 기본 지원

---

## 팀 합의가 필요한 것

### 1. 라우트 키

`src/momento/routes.js`의 `ROUTES`가 세 사람의 화면 이름을 맞추는 기준입니다.
각자 문자열을 하드코딩하면(`'capsule'` vs `'timecapsule'` vs `'time-capsule'`) 하단 내비가 동작하지 않습니다.

### 2. 하단 내비 소유권

`BottomNav`는 3명이 공유하는 유일한 컴포넌트라 가장 충돌하기 쉽습니다.
각자 만들면 하나만 살아남고 나머지 화면은 내비와 안 맞게 됩니다.

권장: **셸 담당자 한 명이 소유**하고, 나머지는 `items` / `availableRoutes` prop으로 주입.
현재 `availableRoutes` 기본값은 담당 화면 2개뿐이라 홈/친구/마이는 비활성으로 보입니다.
팀원 화면이 붙으면 `Object.values(ROUTES)`를 넘기세요.

### 3. 디자인 토큰

`momento.css`의 토큰은 `--momento-` 프리픽스가 붙어 있어 충돌하지 않습니다.
팀에서 공용 토큰을 쓰기로 하면 이 파일의 값만 팀 토큰으로 교체하면 됩니다.

---

## 스타일 규칙 (수정할 때 주의)

CSS 충돌을 막기 위한 구조라 지키지 않으면 조용히 깨집니다.

1. **컴포넌트 스타일은 반드시 `*.module.css`.** 전역 CSS에 `.toolbar` `.fab` 같은 흔한 이름을 쓰면
   팀원 스타일과 충돌하고, 나중에 로드된 쪽이 이깁니다.
2. **커스텀 프로퍼티는 `--momento-` 프리픽스.** CSS Modules는 커스텀 프로퍼티를 스코프하지 않습니다.
3. **`momento.css`의 리셋은 `:where()`로 감싸 명시도 0을 유지.**
   `.momento-root button { font: inherit }`(0,1,1)로 두면 `.item { font-size: 10px }`(0,1,0)를 이겨서
   하단 내비 라벨이 16px로 렌더됩니다. 실제로 겪은 문제입니다.
4. **상태 클래스는 자손 형태로.**
   `.tabs button { background: transparent }`(0,1,1)가 있으면 `.tabSelected`(0,1,0)는 무시됩니다.
   `.tabs .tabSelected`(0,2,0)로 써야 선택 탭이 칠해집니다.

---

## 대응 범위

| 폭     | 동작                                             |
| ------ | ------------------------------------------------ |
| ~359px | `--momento-gutter` 14px까지 축소, 카드 밀도 완화 |
| 393px  | 기준값 (gutter 20px)                             |
| 394px~ | 여백 20px 고정, 늘어난 폭은 본문에 배분          |
| 520px~ | 393×852 카드로 중앙 배치                         |

높이는 `100dvh` 기준이고 `main`만 스크롤하므로 852보다 짧은 기기(SE)도 하단 내비가 잘리지 않습니다.
393×852 / 360×800 / 320×568 / 430×932 / 1440×900 / 가로 모드에서 렌더 검증했습니다.
