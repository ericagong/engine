import type { PersistedFlowState } from "@/entities/types";
import type { FlowStore } from "@/entities/store/store";
import { useFlowStore } from "@/entities/store/store";
import { saveFlowState } from "./database";

function toPersistedState(store: FlowStore): PersistedFlowState {
  return {
    sectionsByKey: store.sectionsByKey,
    actionsById: store.actionsById,
    stepsById: store.stepsById,
  };
}

const DEBOUNCE_MS = 500;
function createDebouncedSave() {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let unsaved: PersistedFlowState | null = null;

  function save() {
    if (unsaved) {
      saveFlowState(unsaved).catch(() => {});
      unsaved = null;
    }
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function requestSave(state: PersistedFlowState) {
    unsaved = state;
    if (timer) clearTimeout(timer);
    timer = setTimeout(save, DEBOUNCE_MS);
  }

  return { requestSave, save };
}

// TODO 탭 간 동시 쓰기 문제 해결 필요
export function subscribeToPersist(): () => void {
  const { requestSave, save } = createDebouncedSave();

  const unsubscribe = useFlowStore.subscribe((state) => {
    if (!state._hydrated) return;
    requestSave(toPersistedState(state));
  });

  // 탭 전환/닫기 시 대기 중인 변경을 즉시 저장
  function onVisibilityChange() {
    if (document.hidden) save();
  }

  document.addEventListener("visibilitychange", onVisibilityChange);

  return () => {
    unsubscribe();
    document.removeEventListener("visibilitychange", onVisibilityChange);
    save();
  };
}
