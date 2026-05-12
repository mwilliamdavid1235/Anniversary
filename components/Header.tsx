"use client";

interface HeaderProps {
  title: string;
  subtitle?: string;
  startDate: string;
  endDate: string;
}

function formatDateRange(start: string, end: string): string {
  const s = new Date(start + "T12:00:00");
  const e = new Date(end + "T12:00:00");
  const month = s.toLocaleDateString("en-US", { month: "long" });
  const year  = s.getFullYear();
  return `${month} ${s.getDate()}–${e.getDate()}, ${year}`;
}

export default function Header({ title, subtitle, startDate, endDate }: HeaderProps) {
  const dateRange = formatDateRange(startDate, endDate);

  return (
    <header className="relative overflow-hidden border-b border-[#1E3319]">
      {/* Background texture — faint grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(196,154,69,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(196,154,69,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-2xl mx-auto px-6 pt-12 pb-10">
        {/* Eyebrow */}
        <p
          className="text-[10px] tracking-[0.2em] uppercase mb-4"
          style={{ color: "#C49A45", fontFamily: "var(--font-dm-mono)" }}
        >
          Pecan &amp; Poplar &nbsp;·&nbsp; Private Itinerary
        </p>

        {/* Title */}
        <h1
          className="font-display italic leading-none mb-2"
          style={{
            fontSize: "clamp(42px, 10vw, 72px)",
            color: "#E2D9C6",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </h1>

        {/* Subtitle row */}
        <div className="flex items-center gap-3 mt-4">
          <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, #C49A45 0%, transparent 100%)", maxWidth: "60px" }} />
          <span
            className="text-[11px] tracking-[0.12em] uppercase"
            style={{ color: "#6E8A74" }}
          >
            {subtitle ?? "A weekend for two"}
          </span>
          <span className="text-[10px]" style={{ color: "#3A5040" }}>·</span>
          <span
            className="text-[11px] tracking-[0.06em]"
            style={{ color: "#6E8A74" }}
          >
            {dateRange}
          </span>
        </div>
      </div>
    </header>
  );
}
