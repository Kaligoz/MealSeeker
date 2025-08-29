import { FC } from 'react';
import Image from "next/image";
import { Clock, Utensils } from 'lucide-react';

interface dishCardProps {
  image: string,
  title: string,
  description: string,
  servings: number,
  timeToCook: number,
}

const DishCard: FC<dishCardProps> = ({ image, title, description, servings, timeToCook}) => {
  return <div className='flex flex-row justify-between items-center gap-2.5'>
    <Image src={image} alt={title} width={480} height={360} className='rounded-md'/>
    <div className='flex flex-col justify-start items-start'>
        <h2 className='font-merriweather text-2xl mb-1.5'>{title}</h2>
        <div className='flex flex-row justify-start items-center gap-3 mb-3'>
          <div className='rounded-full bg-[#FF6B35] w-[6px] h-[6px]'></div>
          <div className='rounded-full bg-[#FF6B35] w-[170px] h-[3px]'></div>
        </div>
        <p className='font-merriweather max-w-[480px] mb-3'>{description}</p>
        <p className='font-merriweather flex flex-row justify-start items-center gap-2 mb-3'><Clock className='w-6 h-6'/> {timeToCook} min</p>
        <p className='font-merriweather flex flex-row justify-start items-center gap-2 mb-3'><Utensils className='w-6 h-6'/> {servings} servings</p>
    </div>
  </div>
}

export default DishCard