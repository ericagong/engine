import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "./Layout";
import { PlanPage } from "@/pages/PlanPage";
import { ExecutePage } from "@/pages/ExecutePage";
import { ReflectPage } from "@/pages/ReflectPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/plan" replace /> },
      { path: "plan", element: <PlanPage /> },
      { path: "execute", element: <ExecutePage /> },
      { path: "reflect", element: <ReflectPage /> },
    ],
  },
]);
