import { useActivities } from "./hooks/useActivities";
import ActivityForm from "./components/ActivityForm";
import ActivityFeed from "./components/ActivityFeed";
import ScoreBar from "./components/ScoreBar";
import Toast from "./components/Toast";

function exportToCSV(activities) {
  const header = "Name,Category,Date\n";
  const rows = activities.map((a) => `"${a.name}","${a.category}","${a.date}"`).join("\n");
  const blob = new Blob([header + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = "pathcredits.csv"; a.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const { activities, addActivity, deleteActivity, editActivity, clearAll, totalScore, streak, earnedBadges, toast } = useActivities();

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1.5rem", minHeight: "100vh" }}>
      <header style={{ marginBottom: "2rem", borderBottom: "1px solid var(--border)", paddingBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)", boxShadow: "0 0 8px var(--accent)" }} />
          <span style={{ fontSize: "0.7rem", fontFamily: "'JetBrains Mono', monospace", color: "var(--muted)", letterSpacing: "0.15em", textTransform: "uppercase" }}>Studor OS v1.0</span>
        </div>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 600, letterSpacing: "-0.02em" }}>
          PathCredit <span style={{ color: "var(--accent)" }}>Logger</span>
        </h1>
        <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: 4 }}>Track your milestones. Build your profile.</p>
      </header>

      <ScoreBar activities={activities} totalScore={totalScore} streak={streak} earnedBadges={earnedBadges} />
      <ActivityForm onAdd={addActivity} activities={activities} />
      <ActivityFeed
        activities={activities}
        onDelete={deleteActivity}
        onEdit={editActivity}
        onClear={clearAll}
        onExport={() => exportToCSV(activities)}
      />
      <Toast message={toast} />
    </div>
  );
}