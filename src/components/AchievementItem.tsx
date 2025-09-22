import { FC } from 'react';

interface AchievementItemProps {
  logo: string,
  title: string,
  description: string,
  isUnlocked: boolean | false, 
};

const AchievementItem: FC<AchievementItemProps> = ({ logo, title, description, isUnlocked}) => {
  return (
    <div className={`flex flex-col items-center justify-between${isUnlocked ? " " : "grayscale"}`}>
        <h1 className='text-2xl'>{logo}</h1>
        <p className='text-lg font-parisienne'>{title}</p>
        <p className='text-lg font-merriweather'>{description}</p>
    </div>)
};

export default AchievementItem