import { createBrowserRouter } from "react-router";
import LoginPage from "./components/LoginPage";
import DashboardPage from "./components/DashboardPage";
import CodeAnalysisPage from "./components/CodeAnalysisPage";
import HistoryPage from "./components/HistoryPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LoginPage,
  },
  {
    path: "/dashboard",
    Component: DashboardPage,
  },
  {
    path: "/analyze",
    Component: CodeAnalysisPage,
  },
  {
    path: "/history",
    Component: HistoryPage,
  },
]);
