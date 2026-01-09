"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="stageCinematic" style={{ flexDirection: "column", gap: 20 }}>
      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", color: "#ff74b7" }}>
        稍等片刻...
      </h2>
      <p style={{ color: "rgba(255,255,255,0.7)" }}>浪漫正在重新加载</p>
      <button
        onClick={() => reset()}
        style={{
          padding: "10px 30px",
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,116,183,0.5)",
          color: "#fff",
          borderRadius: "20px",
          cursor: "pointer",
          marginTop: 20,
          fontFamily: "var(--font-sans)",
        }}
      >
        重新开始
      </button>
    </div>
  );
}
