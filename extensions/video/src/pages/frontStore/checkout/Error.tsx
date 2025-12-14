import React from "react";

export default function CheckoutErrorBoundary() {
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const handler = (event: PromiseRejectionEvent) => {
      const reason = event.reason;

      if (!reason) {
        return;
      }

      if (reason instanceof Error) {
        const message = reason.message || "";

        if (
          message.toLowerCase().includes("subscription") ||
          message.toLowerCase().includes("checkout")
        ) {
          setError(message);
        }
      }
    };

    window.addEventListener("unhandledrejection", handler);

    return () => {
      window.removeEventListener("unhandledrejection", handler);
    };
  }, []);

  if (!error) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "1.5rem 2rem",
          borderRadius: "8px",
          maxWidth: "480px",
          width: "100%",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          border: "1px solid #fca5a5",
          color: "#991b1b",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "1rem", fontWeight: 500 }}>{error}</p>

        <button
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1.25rem",
            backgroundColor: "#991b1b",
            color: "#fff",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() => setError(null)}
        >
          OK
        </button>
      </div>
    </div>
  );
}
export const layout = {
  areaId: "content",
  sortOrder: 10,
};
