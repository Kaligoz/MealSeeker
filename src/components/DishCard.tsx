import { FC } from 'react';
import Image from "next/image";
import { Heart } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';

interface dishCardProps {
  image: string,
  title: string,
  likes: number,
  missingIng: string[],
  id: number,
};

const DishCard: FC<dishCardProps> = ({ image, title, likes, missingIng, id }) => {

  return <div className='flex flex-row items-center gap-10 mb-5'>
    <Image src={image} alt={title} width={312} height={231} className='rounded-md'/> 
    <div className='flex flex-col justify-start items-start'>
      <h2 className='font-merriweather text-2xl mb-1.5'>{title}</h2>
      <div className='flex flex-row justify-start items-center gap-3 mb-5'>
        <div className='rounded-full bg-[#FF6B35] w-[6px] h-[6px]'></div>
        <div className='rounded-full bg-[#FF6B35] w-[170px] h-[3px]'></div>
      </div>
      <p className='font-merriweather max-w-[480px] mb-3'>Missing ingredients: {missingIng.join(', ')}</p>
      <p className='font-merriweather flex flex-row justify-start items-center gap-2 mb-5'><Heart className='w-6 h-6'/> {likes}</p>
      <Button className='font-light text-xl bg-[#004E89] text-[#EFEFD0] cursor-pointer hover:bg-[#1A659E]'><Link href={`/recipes/${id}`}>See more</Link></Button>
    </div>
  </div>
};

export default DishCard