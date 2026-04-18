import { useState, useEffect } from "react";
import { CATEGORY_POINTS, MILESTONES, CATEGORY_MILESTONE } from "../constants";

export function useActivities() {
  const [activities, setActivities] = useState(() => {
    try {
      const saved = localStorage.getItem("pathcredits");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toast, setToast] = useState("");
  const [earnedBadges, setEarnedBadges] = useState(() => {
    try {
      const saved = localStorage.getItem("pathcredits-badges");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("pathcredits", JSON.stringify(activities));
    localStorage.setItem("pathcredits-badges", JSON.stringify(earnedBadges));
  }, [activities, earnedBadges]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }

  function checkMilestones(newActivities, newActivity) {
    const newBadges = [];

    MILESTONES.forEach(({ count, message }) => {
      if (newActivities.length === count && !earnedBadges.includes(message)) {
        newBadges.push(message);
      }
    });

    const catKey = CATEGORY_MILESTONE[newActivity.category];
    const isFirstOfCat = !newActivities.slice(1).some((a) => a.category === newActivity.category);
    if (catKey && isFirstOfCat && !earnedBadges.includes(catKey)) {
      newBadges.push(catKey);
    }

    if (newBadges.length > 0) {
      setEarnedBadges((prev) => [...prev, ...newBadges]);
      showToast(newBadges[0]);
    } else {
      showToast("Activity added!");
    }
  }

  function addActivity(activity) {
    const newActivities = [activity, ...activities];
    setActivities(newActivities);
    checkMilestones(newActivities, activity);
  }

  function deleteActivity(id) {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    showToast("Activity removed.");
  }

  function editActivity(id, updated) {
    setActivities((prev) => prev.map((a) => (a.id === id ? { ...a, ...updated } : a)));
    showToast("Activity updated!");
  }

  function clearAll() {
    setActivities([]);
    setEarnedBadges([]);
    showToast("All activities cleared.");
  }

  const totalScore = activities.reduce((sum, a) => sum + (CATEGORY_POINTS[a.category] || 0), 0);

  const streak = (() => {
    if (activities.length === 0) return 0;
    const dates = [...new Set(activities.map((a) => a.date))].sort().reverse();
    let count = 1;
    for (let i = 0; i < dates.length - 1; i++) {
      const curr = new Date(dates[i]);
      const prev = new Date(dates[i + 1]);
      const diff = (curr - prev) / (1000 * 60 * 60 * 24);
      if (diff === 1) count++;
      else break;
    }
    return count;
  })();

  return {
    activities,
    addActivity,
    deleteActivity,
    editActivity,
    clearAll,
    totalScore,
    streak,
    earnedBadges,
    toast,
  };
}