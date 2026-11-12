import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import type { Lang, LayoutCtx } from "../../types";

export default function Layout() {
  const [lang, setLang] = useState<Lang>("fr");
  const ctx: LayoutCtx = { lang, setLang };

  return (
    <div className="layout">
      <Sidebar />
      <div className="layout__main">
        <Topbar lang={lang} onLang={setLang} />
        <main className="content">
          <Outlet context={ctx} />
        </main>
      </div>
    </div>
  );
}
