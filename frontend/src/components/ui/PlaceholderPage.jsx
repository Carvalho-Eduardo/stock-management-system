import { Construction, Boxes } from "lucide-react";

function PlaceholderPage({ titulo, descricao }) {
  return (
    <div className="flex min-h-[calc(100vh-150px)] items-center justify-center">
      <section className="relative w-full max-w-2xl overflow-hidden rounded-[22px] bg-[#19191D] px-6 py-16 text-center sm:px-12">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#477FFF]/10 blur-3xl" />

        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-[#A9BFFF]/20 bg-[#A9BFFF]/10 text-[#A9BFFF]">
          <Boxes size={36} strokeWidth={1.4} />
        </div>

        <p className="relative mt-8 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A9BFFF]">
          StockFlow
        </p>

        <h1 className="relative mt-3 text-2xl font-semibold tracking-tight text-white">
          {titulo}
        </h1>

        <p className="relative mx-auto mt-3 max-w-md text-sm leading-6 text-[#9999A1]">
          {descricao || "Esta página será desenvolvida nas próximas etapas."}
        </p>

        <div className="relative mx-auto mt-8 inline-flex items-center gap-2 rounded-full border border-[#A9BFFF]/20 bg-[#A9BFFF]/10 px-4 py-2 text-xs font-medium text-[#A9BFFF]">
          <Construction size={15} />
          Módulo em desenvolvimento
        </div>
      </section>
    </div>
  );
}

export default PlaceholderPage;
