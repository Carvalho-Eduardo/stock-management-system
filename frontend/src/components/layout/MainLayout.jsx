import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";

function MainLayout() {
  return (
    <div className="h-screen overflow-hidden bg-[#101D2D] p-0 sm:p-3 lg:p-5">
      <div className="mx-auto flex h-full max-w-[1800px] overflow-hidden bg-[#09090D] shadow-2xl sm:rounded-[24px]">
        {/* Menu lateral fixo */}
        <Sidebar />

        {/* Área principal */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-[#09090D]">
          {/* Cabeçalho */}
          <div className="shrink-0">
            <Header />
          </div>

          {/* Somente esta área terá rolagem */}
          <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-7 xl:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
