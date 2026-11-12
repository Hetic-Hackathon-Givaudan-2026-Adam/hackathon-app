import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import NewProjectPage from "./pages/NewProjectPage";
import AssistantPage from "./pages/AssistantPage";
import SamplesPage from "./pages/SamplesPage";
import OrdersPage from "./pages/OrdersPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="projets" element={<ProjectsPage />} />
        <Route path="projets/nouveau" element={<NewProjectPage />} />
        <Route path="projets/nouveau/assistant" element={<AssistantPage />} />
        <Route path="echantillons" element={<SamplesPage />} />
        <Route path="commandes" element={<OrdersPage />} />
        <Route path="profil" element={<ProfilePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
