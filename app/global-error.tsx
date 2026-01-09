"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ background: "#050208", color: "#fff", margin: 0 }}>
        <div style={{ 
          height: "100vh", 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center",
          fontFamily: "serif"
        }}>
          <h2 style={{ fontSize: "2rem", color: "#ff74b7", marginBottom: "1rem" }}>
            发生了一点小意外
          </h2>
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
            }}
          >
            刷新重试
          </button>
        </div>
      </body>
    </html>
  );
}
