import { Outlet } from "react-router-dom";
import { AppHeader } from "@/widgets/header/AppHeader";
import { BoardHeader } from "@/widgets/board/BoardHeader";

export function Layout() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <AppHeader />
      <main className="flex flex-1 flex-col overflow-hidden bg-muted/40">
        <BoardHeader />
        <div className="flex flex-1 flex-col overflow-hidden p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
