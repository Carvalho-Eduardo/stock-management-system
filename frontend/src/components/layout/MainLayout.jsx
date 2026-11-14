import { useCallback, useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileNavigation from "./MobileNavigation";

function MainLayout() {
  const [menuAberto, setMenuAberto] = useState(false);

  const abrirMenu = useCallback(() => {
    setMenuAberto(true);
  }, []);

  const fecharMenu = useCallback(() => {
    setMenuAberto(false);
  }, []);

  return (
    <div className="h-dvh overflow-hidden bg-[#101D2D] p-0 sm:p-3 lg:p-5">
      <div className="mx-auto flex h-full max-w-[1800px] overflow-hidden bg-[#09090D] shadow-2xl sm:rounded-[24px]">
        <div className="hidden md:flex">
          <Sidebar />
        </div>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#09090D]">
          <div className="shrink-0">
            <Header onMenuClick={abrirMenu} />
          </div>

          <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-4 pb-28 sm:p-6 sm:pb-28 lg:p-7 lg:pb-8 xl:p-8">
            <Outlet />
          </main>
        </div>
      </div>

      <MobileNavigation
        menuAberto={menuAberto}
        onAbrir={abrirMenu}
        onFechar={fecharMenu}
      />
    </div>
  );
}

export default MainLayout;
