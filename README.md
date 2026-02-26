# Engine — Phase 기반 칸반 보드

React 19 + Zustand 5 + Tailwind CSS v4 + shadcn/ui 기반의 Desktop 전용 Phase 기반 보드(Plan / Execute / Reflect).

---

## 개발 로드맵

### 3단계: DnD 구현

Action 카드를 섹션 간/내에서 DnD로 이동·정렬 가능. Step은 같은 카드 내에서만 DnD 정렬 가능.

#### 의존성

```bash
pnpm add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

#### 파일 작업

| 작업 | 파일                                            | 설명                                                             |
| ---- | ----------------------------------------------- | ---------------------------------------------------------------- |
| 신규 | `src/features/action-dnd/ui/SortableAction.tsx` | useSortable Action 래퍼                                          |
| 신규 | `src/features/step-dnd/ui/SortableStep.tsx`     | useSortable Step 래퍼                                            |
| 수정 | `src/entities/board/model/store.ts`             | `findSectionByActionId` 헬퍼 추가                                |
| 수정 | `src/widgets/board/BoardLayout.tsx`             | 보드 레벨 DndContext + onDragEnd 핸들러 + DragOverlay            |
| 수정 | `src/widgets/board/Section.tsx`                 | SortableContext + useDroppable 적용                              |
| 수정 | `src/widgets/board/ActionCard.tsx`              | 드래그 핸들 props + Step DnD용 중첩 DndContext + SortableContext |
| 수정 | `src/widgets/board/StepItem.tsx`                | 드래그 핸들 아이콘 추가                                          |

> **제거된 항목**
>
> - ~~`src/app/providers/DndProvider.tsx`~~ → `BoardLayout.tsx`에서 직접 처리
> - ~~`src/entities/board/lib/reorder.ts`~~ → store 기존 메서드(`reorderStepsWithinAction`, `reorderActionWithinSection`, `moveAction`) 활용
> - ~~`src/widgets/board/StepList.tsx`~~ → `ActionCard.tsx` 내부에서 처리

#### DnD 아키텍처

```
<BoardLayout>
  <DndContext>                        ← Action DnD (보드 레벨)
    <Section>
      <SortableContext items={actionIds}>
        <SortableAction>
          <ActionCard>
            <DndContext>              ← Step DnD (카드 내부, 중첩)
              <SortableContext items={stepIds}>
                <SortableStep>
                  <StepItem />
                </SortableStep>
              </SortableContext>
            </DndContext>
          </ActionCard>
        </SortableAction>
      </SortableContext>
    </Section>
    <DragOverlay />
  </DndContext>
</BoardLayout>
```

#### 핵심 분기 (onDragEnd)

- `active.data.type === 'step'`: 같은 actionId → `reorderStepsWithinAction`, 다른 action → 무시
- `active.data.type === 'action'`: 같은 section → `reorderActionWithinSection`, 다른 section → `moveAction`

#### 완료 기준

- [ ] Action 카드 섹션 내 순서 변경 (DnD)
- [ ] Action 카드 섹션 간 이동 (DnD)
- [ ] 빈 섹션에도 드롭 가능
- [ ] DragOverlay로 드래그 미리보기
- [ ] Step 같은 카드 내에서만 순서 변경
- [ ] Step 다른 카드로 이동 불가
- [ ] 핸들에서만 드래그 시작
- [ ] 체크/클릭과 드래그 이벤트 충돌 없음
- [ ] Reflect에서 backlog → 다른 섹션으로 DnD 분배 가능
- [ ] `pnpm build` 타입 에러 없이 성공

---

## 검증 방법

각 단계 완료 시:

1. `pnpm build` — 타입 에러 없이 빌드 성공
2. `pnpm dev` — 브라우저에서 기능 동작 확인
3. `pnpm lint` — ESLint/Prettier 통과
4. 수동 테스트: Phase 전환, Action/Step CRUD, DnD 동작 확인

## 커밋 컨벤션

- `feat: 3단계 — Action/Step DnD 구현`

## TODOS

- [ ] 필요시 Github Actions로 CI/CD 자동화
