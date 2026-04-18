import PropTypes from "prop-types";
import { CATEGORIES, CATEGORY_POINTS } from "../constants";

const CAT_COLORS = {
  Academic: "#06b6d4",
  Technical: "#7c3aed",
  Cultural: "#f59e0b",
  Sports: "#10b981",
};

export default function ScoreBar({ activities, totalScore, streak, earnedBadges }) {
  const total = activities.length;

  return (
    <div style={{ marginBottom: "2rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 16 }}>
        {[
          { label: "PathCredits", value: totalScore, unit: "pts", color: "var(--accent)" },
          { label: "Activities", value: total, unit: "", color: "var(--accent2)" },
          { label: "Day Streak", value: streak, unit: `day${streak !== 1 ? "s" : ""}`, color: "var(--warning)" },
        ].map(({ label, value, unit, color }) => (
          <div key={label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px" }}>
            <div style={{ fontSize: "0.65rem", fontFamily: "'JetBrains Mono', monospace", color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>{label}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: "1.6rem", fontWeight: 600, color, fontFamily: "'JetBrains Mono', monospace" }}>{value}</span>
              {unit && <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>{unit}</span>}
            </div>
          </div>
        ))}
      </div>

      {total > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", height: 6, borderRadius: 4, overflow: "hidden", background: "var(--surface2)", marginBottom: 8 }}>
            {CATEGORIES.map((cat) => {
              const pct = (activities.filter((a) => a.category === cat).length / total) * 100;
              return pct > 0 ? (
                <div key={cat} style={{ width: `${pct}%`, background: CAT_COLORS[cat], transition: "width 0.4s ease" }} title={`${cat}: ${pct.toFixed(0)}%`} />
              ) : null;
            })}
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {CATEGORIES.map((cat) => {
              const count = activities.filter((a) => a.category === cat).length;
              const pts = count * CATEGORY_POINTS[cat];
              return count > 0 ? (
                <span key={cat} style={{ fontSize: "0.72rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: 5, fontFamily: "'JetBrains Mono', monospace" }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: CAT_COLORS[cat], display: "inline-block" }} />
                  {cat} · {count} · <span style={{ color: CAT_COLORS[cat] }}>{pts}pt{pts !== 1 ? "s" : ""}</span>
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}

      {earnedBadges.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
          {earnedBadges.map((badge) => (
            <span key={badge} style={{ fontSize: "0.72rem", fontFamily: "'JetBrains Mono', monospace", background: "var(--surface2)", color: "var(--warning)", padding: "4px 10px", borderRadius: 20, border: "1px solid var(--warning)", display: "flex", alignItems: "center", gap: 5 }}>
              ★ {badge}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

ScoreBar.propTypes = {
  activities: PropTypes.array.isRequired,
  totalScore: PropTypes.number.isRequired,
  streak: PropTypes.number.isRequired,
  earnedBadges: PropTypes.array.isRequired,
};