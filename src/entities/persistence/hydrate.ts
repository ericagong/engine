import { useFlowStore } from "@/entities/store/store";
import { loadFlowState } from "./database";

export async function hydrateStore(): Promise<void> {
  try {
    const savedFlowState = await loadFlowState();

    if (savedFlowState) {
      useFlowStore.setState({ ...savedFlowState, _hydrated: true });
    } else {
      useFlowStore.setState({ _hydrated: true });
    }
  } catch {
    // IDB 접근 실패 시 초기 상태 유지
    // - 시크릿/프라이빗 모드 — 일부 브라우저에서 IDB 접근 자체를 차단
    // - 저장 공간 부족 — 디스크가 꽉 찬 경우
    // - 브라우저 보안 정책 — iframe 내 third-party context에서 차단
    // - 손상된 DB — 드물지만 IDB 데이터가 깨진 경우
    useFlowStore.setState({ _hydrated: true });
  }
}
