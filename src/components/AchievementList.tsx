"use client"

import { useEffect, useState } from "react";
import AchievementItem from "./AchievementItem";
import data from "@/lib/achievementData.json";

interface Achievement {
    icon: string,
    title: string,
    description: string,
    isUnlocked: boolean,
};

const AchievementList = () => {
    const [achievements, setAchievements] = useState<Achievement[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("achievements");
        if (stored) {
            const parsed = JSON.parse(stored)
            if (Array.isArray(parsed)) {
                setAchievements(parsed);
            } else if (parsed.achievementData) {
                setAchievements(parsed.achievementData);
            }
        } else {
            localStorage.setItem("achievements", JSON.stringify(data.achievementData))
            setAchievements(data.achievementData)
        }
    }, [])

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
            <AchievementItem
            key={title}
            logo={icon}
            title={title}
            description={description}
            isUnlocked={isUnlocked}
            />
        ))}

        {/*test button to unlock one badge */}
        <button
            onClick={() => unlockAchievement("New Chef")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
            Unlock &quot;New Chef&quot;
        </button>
        </div>
    );
};

export default AchievementList
