# Engine — Phase 기반 칸반 보드

React 19 + Zustand 5 + Tailwind CSS v4 + shadcn/ui 기반의 Desktop 전용 Phase 기반 보드(Plan / Execute / Reflect).

## TODOS

- [ ] 필요시 Github Actions로 CI/CD 자동화
- [V] 렌더링 성능 저하시 actionsById[], StepsById[] 방식으로 정규화
- [ ] 탭 간 동시 쓰기 문제 해결 필요

## IDB 추가

서버리스 환경에서 새로고침 시 데이터 유실을 방지하기 위해 브라우저 IndexedDB 기반 영속성 레이어 도입

### Why IDB?

- zustand persist vs localStorage vs sessionStorage vs IDB vs cache API
