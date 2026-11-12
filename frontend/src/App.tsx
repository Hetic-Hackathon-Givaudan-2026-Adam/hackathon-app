import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import SamplesPage from "./pages/SamplesPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import AssistantPage from "./pages/AssistantPage";

export default function App() {
  return (
    <Routes>
      {/* Page plein écran, sans le menu : conversation avec l'assistant IA */}
      <Route path="assistant" element={<AssistantPage />} />
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="projets" element={<ProjectsPage />} />
        <Route path="echantillons" element={<SamplesPage />} />
        <Route path="commandes" element={<OrdersPage />} />
        <Route path="profil" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
