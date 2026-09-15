/**
 * 3명이 공유하는 라우트 키.
 *
 * 이 파일은 의존성이 하나도 없습니다. 팀원이 라우터 설정에서 import 할 때
 * react나 lucide-react가 따라 들어오지 않도록 일부러 분리했습니다.
 *
 * 합병할 때: 이 객체가 세 사람의 화면 이름을 맞추는 유일한 기준입니다.
 * 문자열을 각자 하드코딩하면('capsule' vs 'timecapsule' vs 'time-capsule')
 * 하단 내비가 동작하지 않으므로 반드시 여기 값을 쓰세요.
 */
export const ROUTES = {
  home: 'home',
  friends: 'friends',
  capsule: 'capsule',
  archive: 'archive',
  my: 'my',
}

/** 이 저장소가 담당하는 화면. 나머지는 다른 팀원 담당입니다. */
export const OWNED_ROUTES = [ROUTES.capsule, ROUTES.archive]
