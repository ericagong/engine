# Engine — Phase 기반 칸반 보드

React 19 + Zustand 5 + Tailwind CSS v4 + shadcn/ui 기반의 Desktop 전용 Phase 기반 보드(Plan / Execute / Reflect).

## TODOS

- [ ] 필요시 Github Actions로 CI/CD 자동화
- [ ] 렌더링 성능 저하시 actionsById[], StepsById[] 방식으로 정규화

---

# DnD 재구축 단계별 계획

## Step 1: 섹션 간 이동

다른 섹션으로 Action을 옮길 수 있게 한다.

- `Section.tsx`: useDroppable로 빈 섹션도 드롭 대상으로 등록
- `Board.tsx`: DraggableContainer에 handleDragOver 추가, moveActionToSection 호출
- 필요시 DndData 타입에 SectionDropData 추가

---

## Step 2: DragOverlay

드래그 중인 카드의 미리보기를 표시한다.

- `Board.tsx`: DraggableContainer에 DragOverlay + activeActionId 상태
- handleDragStart에서 activeActionId 설정, handleDragEnd에서 초기화

---

## Step 3: Step 정렬

ActionItem 안에서 Step을 드래그하여 순서 변경한다.

- `ActionItem.tsx`: StepList에 DndContext + SortableContext + SortableStepItem
- StepDragData 타입 인라인 정의
- compositeId: `step:${actionId}:${stepId}`
- handleStepDragEnd에서 moveStep 호출
