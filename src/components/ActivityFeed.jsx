import { useState } from "react";
import PropTypes from "prop-types";
import { CATEGORIES } from "../constants";
import { formatDate } from "../utils/formatDate";

const SORT_OPTIONS = ["Newest", "Oldest", "A–Z"];
const CAT_COLORS = { Academic: "#06b6d4", Technical: "#7c3aed", Cultural: "#f59e0b", Sports: "#10b981" };

export default function ActivityFeed({ activities, onDelete, onEdit, onClear, onExport }) {
  const [activeCategories, setActiveCategories] = useState([]);
  const [sort, setSort] = useState("Newest");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const today = new Date().toISOString().split("T")[0];

  function toggleCategory(cat) {
    setActiveCategories((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
  }

  let filtered = activities
    .filter((a) => activeCategories.length === 0 || activeCategories.includes(a.category))
    .filter((a) => a.name.toLowerCase().includes(search.toLowerCase()));

  if (sort === "Newest") filtered = [...filtered].sort((a, b) => b.date.localeCompare(a.date));
  if (sort === "Oldest") filtered = [...filtered].sort((a, b) => a.date.localeCompare(b.date));
  if (sort === "A–Z") filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));

  function startEdit(activity) { setEditingId(activity.id); setEditForm({ name: activity.name, category: activity.category, date: activity.date }); }
  function saveEdit(id) { if (!editForm.name.trim()) return; onEdit(id, { ...editForm, name: editForm.name.trim() }); setEditingId(null); }

  const fieldStyle = { background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 6, padding: "7px 10px", fontSize: "0.85rem", color: "var(--text)", width: "100%", outline: "none", fontFamily: "inherit" };
  const chipBase = { padding: "4px 12px", borderRadius: 20, fontSize: "0.75rem", fontFamily: "'JetBrains Mono', monospace", cursor: "pointer", border: "1px solid var(--border)", transition: "all 0.15s" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <h2 style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Activity Feed</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onExport} style={{ ...chipBase, color: "var(--accent2)", borderColor: "var(--accent2)" }}>↓ Export CSV</button>
          {activities.length > 0 && (
            <button onClick={() => { if (window.confirm("Clear all activities?")) onClear(); }} style={{ ...chipBase, color: "var(--danger)", borderColor: "var(--danger)" }}>✕ Clear All</button>
          )}
        </div>
      </div>

      <input placeholder="Search activities..." value={search} onChange={(e) => setSearch(e.target.value)}
        style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 12px", width: "100%", fontSize: "0.875rem", color: "var(--text)", outline: "none", marginBottom: 10, fontFamily: "inherit" }}
        onFocus={(e) => e.target.style.borderColor = "var(--accent)"}
        onBlur={(e) => e.target.style.borderColor = "var(--border)"}
      />

      <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
        {CATEGORIES.map((c) => {
          const count = activities.filter((a) => a.category === c).length;
          const active = activeCategories.includes(c);
          return (
            <button key={c} onClick={() => toggleCategory(c)}
              style={{ ...chipBase, background: active ? CAT_COLORS[c] + "22" : "transparent", color: active ? CAT_COLORS[c] : "var(--muted)", borderColor: active ? CAT_COLORS[c] : "var(--border)" }}>
              {c} <span style={{ opacity: 0.7 }}>{count}</span>
            </button>
          );
        })}
        {activeCategories.length > 0 && (
          <button onClick={() => setActiveCategories([])} style={{ ...chipBase, color: "var(--muted)" }}>clear</button>
        )}
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        {SORT_OPTIONS.map((s) => (
          <button key={s} onClick={() => setSort(s)}
            style={{ ...chipBase, background: sort === s ? "var(--surface2)" : "transparent", color: sort === s ? "var(--text)" : "var(--muted)", borderColor: sort === s ? "var(--border)" : "transparent" }}>
            {s}
          </button>
        ))}
      </div>

      {activities.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem 0", color: "var(--muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem" }}>
          <div style={{ fontSize: "2rem", marginBottom: 8, opacity: 0.3 }}>◎</div>
          No activities logged yet
        </div>
      )}

      {activities.length > 0 && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "2rem 0", color: "var(--muted)", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem" }}>No results found</div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((a) => (
          <div key={a.id} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px", transition: "border-color 0.2s" }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = "var(--accent)"}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = "var(--border)"}
          >
            {editingId === a.id ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <input value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} maxLength={100} style={fieldStyle} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <select value={editForm.category} onChange={(e) => setEditForm((f) => ({ ...f, category: e.target.value }))} style={fieldStyle}>
                    {CATEGORIES.map((c) => <option key={c} style={{ background: "var(--surface2)" }}>{c}</option>)}
                  </select>
                  <input type="date" value={editForm.date} max={today} onChange={(e) => setEditForm((f) => ({ ...f, date: e.target.value }))} style={fieldStyle} />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => saveEdit(a.id)} style={{ ...chipBase, background: "var(--accent)", color: "#fff", borderColor: "var(--accent)" }}>Save</button>
                  <button onClick={() => setEditingId(null)} style={{ ...chipBase, color: "var(--muted)" }}>Cancel</button>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 500, marginBottom: 3 }}>{a.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: "0.7rem", fontFamily: "'JetBrains Mono', monospace", color: CAT_COLORS[a.category], background: CAT_COLORS[a.category] + "18", padding: "2px 8px", borderRadius: 12 }}>{a.category}</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--muted)", fontFamily: "'JetBrains Mono', monospace" }}>{formatDate(a.date)}</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <button onClick={() => startEdit(a)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: "0.78rem", fontFamily: "'JetBrains Mono', monospace" }}>edit</button>
                  <button onClick={() => onDelete(a.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--danger)", fontSize: "1rem", lineHeight: 1 }}>✕</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

ActivityFeed.propTypes = {
  activities: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
};