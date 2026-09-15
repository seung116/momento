/**
 * 캡슐 목업 데이터와 상수.
 *
 * 합병 시: 호스트 앱은 API나 전역 상태에서 데이터를 받게 됩니다.
 * CapsuleScreen 의 items prop 으로 같은 형태의 배열만 넘기면 되고 이 파일은 지워도 됩니다.
 * 화면 코드에서 이 배열을 직접 import 하지 않습니다. (기본값으로만 사용)
 */

/** @typedef {'개봉 가능'|'작성 중'|'봉인됨'} CapsuleState */

/**
 * @typedef {object} Capsule
 * @property {string}       id      React key 및 선택 식별자. 제목이 중복되어도 안전하도록 필수입니다.
 * @property {number}       year    연도 그룹 기준
 * @property {CapsuleState} state   상태 배지
 * @property {string}       dday    D-DAY / D-365 등 표시용 문자열
 * @property {string}       title
 * @property {string}       desc    간략히 보기에서는 숨겨집니다
 * @property {string}       date    개봉일 표시용 문자열
 * @property {number}       members 참여자 수. 아바타는 3개까지 표시하고 나머지는 +N
 * @property {string}       action  우하단 버튼 라벨
 */

export const CAPSULE_TABS = ['전체', '작성 중', '봉인됨', '개봉 가능']

export const ALL_TAB = '전체'

/** @type {Capsule[]} */
export const capsules = [
  {
    id: 'capsule-2026-reunion',
    year: 2026,
    state: '개봉 가능',
    dday: 'D-DAY',
    title: '2024 우리, 다시 만나는 날',
    desc: '1년 동안 서로에게 응원과 사랑을 보냈던 우리의 소중한 타임캡슐',
    date: '2027년 3월 1일 개봉',
    members: 4,
    action: '열어보기',
  },
  {
    id: 'capsule-2026-twenty',
    year: 2026,
    state: '작성 중',
    dday: 'D-365',
    title: '20살의 우리에게',
    desc: '스무 살의 마지막 날, 서로에게 보내는 편지',
    date: '2027년 12월 31일 개봉',
    members: 3,
    action: '작성하기',
  },
  {
    id: 'capsule-2025-graduation',
    year: 2025,
    state: '봉인됨',
    dday: 'D-91',
    title: '졸업하는 우리에게',
    desc: '함께한 대학 생활을 기억하며 남긴 이야기',
    date: '2026년 12월 15일 개봉',
    members: 5,
    action: '상세보기',
  },
]
