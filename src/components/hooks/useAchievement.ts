"use client"

import { useEffect, useState, useCallback } from "react";
import achievementData from "@/lib/achievementData.json";

interface Achievement {
    icon: string,
    title: string,
    description: string,
    isUnlocked: boolean,
};

export function useAchievement() {
    const [achievements, setAchievements] = useState<Achievement[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("achievements")
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed)) return parsed
        } catch {}
      }
    }
    return achievementData
  })

  useEffect(() => {
    localStorage.setItem("achievements", JSON.stringify(achievements));
  }, [achievements])

  const unlockAchievement = useCallback((title: string) => {
    setAchievements((prev) => {
      const updated = prev.map((a) =>
        a.title === title ? { ...a, isUnlocked: true } : a
      )
      localStorage.setItem("achievements", JSON.stringify(updated))
      return updated;
    })
  }, [])

  return { achievements, unlockAchievement }
};