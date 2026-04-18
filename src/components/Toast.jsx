export default function Toast({ message }) {
  if (!message) return null;
  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24,
      background: "var(--surface2)",
      border: "1px solid var(--accent)",
      boxShadow: "0 0 16px var(--accent-glow)",
      color: "var(--text)",
      padding: "10px 18px",
      borderRadius: 8,
      fontSize: "0.85rem",
      fontFamily: "'JetBrains Mono', monospace",
      zIndex: 1000,
      animation: "slideUp 0.25s ease",
    }}>
      <span style={{ color: "var(--accent)", marginRight: 8 }}>▶</span>{message}
      <style>{`@keyframes slideUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}