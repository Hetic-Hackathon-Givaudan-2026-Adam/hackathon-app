import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import type { Lang } from "../../types";

export default function Layout() {
  const [lang, setLang] = useState<Lang>("fr");

  return (
    <div className="layout">
      <Sidebar />
      <div className="layout__main">
        <Topbar lang={lang} onLang={setLang} />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
