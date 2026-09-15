import { createContext, useContext } from 'react'

/**
 * 셸의 실제 스크롤 컨테이너(<main>) ref 를 하위로 전달합니다.
 *
 * BottomSheet 가 배경 스크롤을 잠글 때 document.body 가 아니라
 * 진짜 스크롤이 일어나는 요소를 잠가야 하기 때문에 필요합니다.
 * (이 앱은 body 가 아니라 main 이 스크롤합니다)
 *
 * 호스트 앱이 PhoneShell 대신 자체 레이아웃을 쓰면 이 Provider 로 자기 스크롤 컨테이너를 넘기세요.
 * Provider 가 없으면 BottomSheet 는 document.body 로 폴백합니다.
 */
export const ShellScrollContext = createContext(null)

export function useShellScrollRef() {
  return useContext(ShellScrollContext)
}
