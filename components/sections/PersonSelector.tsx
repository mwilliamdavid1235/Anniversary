"use client";

export type Person = "mary" | "md";

interface PersonSelectorProps {
  onSelect: (person: Person) => void;
}

export default function PersonSelector({ onSelect }: PersonSelectorProps) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "#0B1309" }}
    >
      <p
        className="mb-2 text-center"
        style={{
          fontSize: "9px",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "#3A5040",
        }}
      >
        ✦ Before we begin
      </p>
      <h1
        className="font-display italic text-center mb-2"
        style={{ fontSize: "clamp(28px, 7vw, 42px)", color: "#E2D9C6" }}
      >
        Who are you?
      </h1>
      <p
        className="text-center mb-10"
        style={{ fontSize: "12px", color: "#6E8A74", maxWidth: 280 }}
      >
        Your answers are yours alone until you choose to share them.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full" style={{ maxWidth: 400 }}>
        {(["mary", "md"] as Person[]).map((p) => (
          <button
            key={p}
            onClick={() => onSelect(p)}
            className="flex-1 rounded-xl flex flex-col items-center justify-center transition-all duration-200 active:scale-95"
            style={{
              padding: "32px 20px",
              background: "rgba(255,255,255,0.025)",
              border: "1px solid #1E3319",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#2D4D28";
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#1E3319";
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.025)";
            }}
          >
            <span
              className="font-display italic mb-1"
              style={{ fontSize: "28px", color: "#E2D9C6" }}
            >
              {p === "mary" ? "Mary" : "MD"}
            </span>
            <span style={{ fontSize: "10px", color: "#3A5040", letterSpacing: "0.1em" }}>
              That's me
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
