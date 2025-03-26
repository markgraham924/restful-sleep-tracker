import React, { createContext, useContext } from "react";
import { vi } from "vitest"; // Add the missing vi import

const AlarmContext = createContext();

export function useAlarm() {
  return useContext(AlarmContext);
}

export function MockAlarmProvider({ children }) {
  // Create mock values and functions
  const mockValues = {
    alarmTime: "07:00",
    setAlarmTime: vi.fn(),
    isAlarmSet: false,
    isAlarmActive: false,
    bedtime: "",
    sleepStarted: false,
    startSleepTracking: vi.fn(),
    stopSleepTracking: vi.fn(),
    resetAlarm: vi.fn(),
    recommendedSleepHours: 8,
    setRecommendedSleepHours: vi.fn(),
    sleepRecommendations: null,
    storeSleepRecommendations: vi.fn()
  };

  return (
    <AlarmContext.Provider value={mockValues}>
      {children}
    </AlarmContext.Provider>
  );
}
