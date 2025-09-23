"use client"

import { useAchievement } from "./hooks/useAchievement";

const AchievementList = () => {

    const { achievements } = useAchievement();

  return (
    <div className="grid grid-cols-2 gap-6">
      {achievements.map(({ icon, title, description, isUnlocked }) => (
        <div
          className={`flex flex-col items-center justify-between ${
            isUnlocked ? "grayscale-0" : "grayscale"
          }`}
          key={title}
        >
          <h1 className="text-2xl">{icon}</h1>
          <p className="text-lg font-parisienne">{title}</p>
          <p className="text-lg font-merriweather">{description}</p>
        </div>
      ))}
    </div>
  )
};

export default AchievementList
