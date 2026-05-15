"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          background: "#0a0a0a",
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          flexDirection: "column",
          gap: "1rem",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: 0 }}>
          Something went wrong
        </h1>
        <p style={{ color: "#999", maxWidth: 480, lineHeight: 1.6 }}>
          The server encountered an error. This usually means the database or
          authentication is not configured yet. Please check your environment
          variables on Vercel.
        </p>
        {error?.digest && (
          <p style={{ color: "#555", fontSize: "0.85rem" }}>
            Error code: {error.digest}
          </p>
        )}
        <button
          onClick={() => reset()}
          style={{
            marginTop: "1rem",
            padding: "0.75rem 2rem",
            background: "linear-gradient(135deg, #a855f7, #ec4899)",
            border: "none",
            borderRadius: "9999px",
            color: "#fff",
            fontWeight: 700,
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
