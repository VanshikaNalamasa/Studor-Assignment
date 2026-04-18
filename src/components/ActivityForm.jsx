import { useState } from "react";
import PropTypes from "prop-types";
import { CATEGORIES } from "../constants";
import { formatDate } from "../utils/formatDate";

const today = new Date().toISOString().split("T")[0];

export default function ActivityForm({ onAdd, activities }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Academic");
  const [date, setDate] = useState(today);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return setError("Activity name cannot be empty.");
    if (name.trim().length > 100) return setError("Name must be 100 characters or fewer.");
    if (!date) return setError("Please select a date.");
    if (date > today) return setError("Future dates are not allowed.");
    const isDuplicate = activities.some((a) => a.name.toLowerCase() === name.trim().toLowerCase() && a.date === date);
    if (isDuplicate) setWarning(`"${name.trim()}" on ${formatDate(date)} already exists.`);
    else setWarning("");
    setError("");
    onAdd({ id: Date.now(), name: name.trim(), category, date });
    setName(""); setDate(today); setCategory("Academic");
  }

  const field = {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    padding: "10px 12px",
    fontSize: "0.9rem",
    color: "var(--text)",
    width: "100%",
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "1.25rem", marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", color: "var(--accent)", fontSize: "0.8rem" }}>+</span>
        <h2 style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Log Activity</h2>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ position: "relative" }}>
          <input placeholder="Activity name" value={name} onChange={(e) => { setName(e.target.value); setError(""); }} maxLength={110} style={{ ...field, paddingRight: 56 }}
            onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
          />
          <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: "0.7rem", fontFamily: "'JetBrains Mono', monospace", color: name.length > 90 ? "var(--danger)" : "var(--muted)" }}>
            {name.length}/100
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ ...field, cursor: "pointer" }}>
            {CATEGORIES.map((c) => <option key={c} style={{ background: "var(--surface2)" }}>{c}</option>)}
          </select>
          <input type="date" value={date} max={today} onChange={(e) => setDate(e.target.value)} style={field}
            onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
          />
        </div>

        {error && <p style={{ color: "var(--danger)", fontSize: "0.8rem", fontFamily: "'JetBrains Mono', monospace" }}>✕ {error}</p>}
        {warning && <p style={{ color: "var(--warning)", fontSize: "0.8rem", fontFamily: "'JetBrains Mono', monospace" }}>⚠ {warning}</p>}

        <button type="submit" style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", alignSelf: "flex-start", transition: "opacity 0.2s", letterSpacing: "0.02em" }}
          onMouseEnter={(e) => e.target.style.opacity = "0.85"}
          onMouseLeave={(e) => e.target.style.opacity = "1"}
        >
          Add Activity →
        </button>
      </form>
    </div>
  );
}

ActivityForm.propTypes = { onAdd: PropTypes.func.isRequired, activities: PropTypes.array.isRequired };