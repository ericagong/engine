import { Outlet } from "react-router-dom";
import { AppHeader } from "@/widgets/AppHeader";

export function Layout() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <AppHeader />
      <main className="flex flex-1 flex-col overflow-hidden bg-muted/40">
        <Outlet />
      </main>
    </div>
  );
}
