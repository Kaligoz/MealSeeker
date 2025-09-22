"use client"

import { useEffect, useState } from "react";
import achievementData from "@/lib/achievementData.json";

interface Achievement {
    icon: string,
    title: string,
    description: string,
    isUnlocked: boolean,
};

const AchievementList = () => {
    const [achievements, setAchievements] = useState<Achievement[]>(() => {
        const stored = localStorage.getItem("achievements")
        if (stored) {
        try {
            const parsed = JSON.parse(stored)
            if (Array.isArray(parsed)) return parsed
        } catch {}
        }
        return achievementData
    })

    useEffect(() => {
        localStorage.setItem("achievements", JSON.stringify(achievements))
    }, [achievements])

    const unlockAchievement = (title: string) => {
        const updated = achievements.map((a) =>
        a.title === title ? { ...a, isUnlocked: true } : a
        )
        setAchievements(updated)
        localStorage.setItem("achievements", JSON.stringify(updated))
    }

    console.log("achievements:", achievements, Array.isArray(achievements));

    return (
        <div className="grid grid-cols-2 gap-6">
        {achievements.map(({ icon, title, description, isUnlocked }) => (
            <div className={`flex flex-col items-center justify-between ${isUnlocked ? "grayscale-0" : "grayscale"}`} key={title}>
                <h1 className='text-2xl'>{icon}</h1>
                <p className='text-lg font-parisienne'>{title}</p>
                <p className='text-lg font-merriweather'>{description}</p>
            </div>
        ))}

        {/*test button to unlock one badge */}
        <button
            onClick={() => unlockAchievement("Chef’s Apprentice")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >Chef’s Apprentice
        </button>
        </div>
    );
};

export default AchievementList
