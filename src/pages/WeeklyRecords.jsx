import React, { useEffect, useState } from "react";
import { getUserSleepData } from "./sleepData";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase-config";
import { FiMoon, FiChevronLeft, FiChevronRight, FiClock } from "react-icons/fi";

const getWeekKey = (dateStr) => {
  const date = new Date(dateStr);
  const dayNr = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - dayNr + 3);
  const firstThursday = new Date(date.getFullYear(), 0, 4);
  const diff = date - firstThursday;
  const weekNumber = 1 + Math.round(diff / (7 * 24 * 60 * 60 * 1000));
  return `${date.getFullYear()}-W${weekNumber}`;
};

const groupByWeek = (entries) => {
  const grouped = {};
  entries.forEach((entry) => {
    const weekKey = getWeekKey(entry.date);
    if (!grouped[weekKey]) {
      grouped[weekKey] = [];
    }
    grouped[weekKey].push(entry);
  });
  return grouped;
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const formatDayName = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { weekday: "short" });
};

const getWeekDateRange = (weekKey) => {
  const [year, weekPart] = weekKey.split("-W");
  const weekNumber = parseInt(weekPart);

  const firstDayOfYear = new Date(parseInt(year), 0, 1);

  const firstDayOfWeek = new Date(firstDayOfYear);
  firstDayOfWeek.setDate(
    firstDayOfYear.getDate() +
      (1 - firstDayOfYear.getDay()) +
      (weekNumber - 1) * 7
  );

  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

  return {
    start: formatDate(firstDayOfWeek),
    end: formatDate(lastDayOfWeek),
  };
};

// Function to get quality color
const getQualityColor = (quality) => {
  if (quality >= 80) return "#38A169"; // Good - green
  if (quality >= 60) return "#4299E1"; // Above average - blue
  if (quality >= 40) return "#ECC94B"; // Average - yellow
  if (quality >= 20) return "#ED8936"; // Below average - orange
  return "#E53E3E"; // Poor - red
};

// Get sleep phase colors
const getSleepPhaseColor = (phase) => {
  switch (phase) {
    case "deep":
      return "#3B82F6";
    case "rem":
      return "#8B5CF6";
    case "light":
      return "#A5B4FC";
    default:
      return "#CBD5E0";
  }
};

const WeeklyRecords = () => {
  const [user] = useAuthState(auth);
  const [groupedRecords, setGroupedRecords] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  const [sortedWeekKeys, setSortedWeekKeys] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const data = await getUserSleepData(user.uid);
        const groups = groupByWeek(data.allEntries || []);
        setGroupedRecords(groups);
        const weeks = Object.keys(groups).sort();
        setSortedWeekKeys(weeks);
        setSelectedWeekIndex(weeks.length ? weeks.length - 1 : 0);
      } catch (error) {
        console.error("Error fetching sleep records:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handlePrev = () => {
    setSelectedWeekIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setSelectedWeekIndex((prev) =>
      prev < sortedWeekKeys.length - 1 ? prev + 1 : prev
    );
  };

  // Calculate weekly averages
  const calculateWeeklyAverages = (records) => {
    if (!records || records.length === 0) return null;

    const avgDuration =
      records.reduce((sum, record) => sum + record.sleepDuration, 0) /
      records.length;

    const avgQuality =
      records.reduce((sum, record) => sum + record.quality, 0) / records.length;

    const avgDeep =
      records.reduce((sum, record) => sum + record.deepSleep, 0) /
      records.length;

    const avgRem =
      records.reduce((sum, record) => sum + record.remSleep, 0) /
      records.length;

    const avgLight =
      records.reduce((sum, record) => sum + record.lightSleep, 0) /
      records.length;

    return {
      avgDuration: avgDuration.toFixed(1),
      avgQuality: Math.round(avgQuality),
      avgDeep: avgDeep.toFixed(1),
      avgRem: avgRem.toFixed(1),
      avgLight: avgLight.toFixed(1),
    };
  };

  if (loading)
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading your sleep records...</p>
      </div>
    );

  if (sortedWeekKeys.length === 0)
    return (
      <div className="page-container">
        <div className="empty-state">
          <FiMoon size={48} />
          <h1>Weekly Sleep Records</h1>
          <p>
            No sleep records found. Start tracking your sleep to see data here.
          </p>
        </div>
      </div>
    );

  const currentWeekKey = sortedWeekKeys[selectedWeekIndex];
  const records = groupedRecords[currentWeekKey];
  const weekDateRange = getWeekDateRange(currentWeekKey);
  const weeklyAverages = calculateWeeklyAverages(records);

  return (
    <div className="sleep-app-container">
      <div className="page-header">
        <h1>Weekly Sleep Records</h1>
        <p className="subtitle">Track and analyze your sleep patterns</p>
      </div>

      <div className="week-navigation">
        <button
          className="nav-button"
          onClick={handlePrev}
          disabled={selectedWeekIndex === 0}
        >
          <FiChevronLeft />
        </button>
        <h2 className="themed-heading">
          {weekDateRange.start} to {weekDateRange.end}
        </h2>
        <button
          className="nav-button"
          onClick={handleNext}
          disabled={selectedWeekIndex === sortedWeekKeys.length - 1}
        >
          <FiChevronRight />
        </button>
      </div>

      {weeklyAverages && (
        <div className="weekly-summary">
          <div className="summary-card">
            <div className="summary-header">
              <h3>Weekly Averages</h3>
            </div>
            <div className="summary-stats">
              <div className="stat-item">
                <FiClock className="stat-icon" />
                <div className="stat-value">{weeklyAverages.avgDuration}h</div>
                <div className="stat-label">Sleep</div>
              </div>
              <div className="stat-item">
                <div
                  className="quality-indicator"
                  style={{
                    backgroundColor: getQualityColor(weeklyAverages.avgQuality),
                  }}
                >
                  {weeklyAverages.avgQuality}
                </div>
                <div className="stat-label">Quality</div>
              </div>
              <div className="stat-phases">
                <div className="phase-bar">
                  <div
                    className="phase-segment deep"
                    style={{
                      flex: weeklyAverages.avgDeep,
                      backgroundColor: getSleepPhaseColor("deep"),
                    }}
                    title={`Deep sleep: ${weeklyAverages.avgDeep}h`}
                  ></div>
                  <div
                    className="phase-segment rem"
                    style={{
                      flex: weeklyAverages.avgRem,
                      backgroundColor: getSleepPhaseColor("rem"),
                    }}
                    title={`REM sleep: ${weeklyAverages.avgRem}h`}
                  ></div>
                  <div
                    className="phase-segment light"
                    style={{
                      flex: weeklyAverages.avgLight,
                      backgroundColor: getSleepPhaseColor("light"),
                    }}
                    title={`Light sleep: ${weeklyAverages.avgLight}h`}
                  ></div>
                </div>
                <div className="phase-legend">
                  <span>
                    <span className="color-dot deep"></span> Deep:{" "}
                    {weeklyAverages.avgDeep}h
                  </span>
                  <span>
                    <span className="color-dot rem"></span> REM:{" "}
                    {weeklyAverages.avgRem}h
                  </span>
                  <span>
                    <span className="color-dot light"></span> Light:{" "}
                    {weeklyAverages.avgLight}h
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="records-list">
        {records.map((record) => (
          <div key={record.id} className="sleep-record-card">
            <div className="record-date">
              <div className="day-name">{formatDayName(record.date)}</div>
              <div className="date">{formatDate(record.date)}</div>
            </div>
            <div className="record-details">
              <div className="record-duration">
                <FiMoon className="duration-icon" />
                <span className="duration-value">{record.sleepDuration}h</span>
              </div>
              <div className="record-quality">
                <div
                  className="quality-pill"
                  style={{ backgroundColor: getQualityColor(record.quality) }}
                >
                  {record.quality}
                </div>
              </div>
              <div className="record-phases">
                <div className="phase-bar">
                  <div
                    className="phase-segment"
                    style={{
                      flex: record.deepSleep,
                      backgroundColor: getSleepPhaseColor("deep"),
                    }}
                    title={`Deep sleep: ${record.deepSleep}h`}
                  ></div>
                  <div
                    className="phase-segment"
                    style={{
                      flex: record.remSleep,
                      backgroundColor: getSleepPhaseColor("rem"),
                    }}
                    title={`REM sleep: ${record.remSleep}h`}
                  ></div>
                  <div
                    className="phase-segment"
                    style={{
                      flex: record.lightSleep,
                      backgroundColor: getSleepPhaseColor("light"),
                    }}
                    title={`Light sleep: ${record.lightSleep}h`}
                  ></div>
                </div>
                <div className="phase-values">
                  <span>Deep: {record.deepSleep}h</span>
                  <span>REM: {record.remSleep}h</span>
                  <span>Light: {record.lightSleep}h</span>
                </div>
              </div>
              <div className="record-interruptions">
                <span className="interruption-label">Interruptions: </span>
                <span className="interruption-value">
                  {record.interruptions}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyRecords;
