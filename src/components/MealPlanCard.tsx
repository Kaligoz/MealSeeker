import { FC } from 'react';
import Image from "next/image";
import { Button } from './ui/button';
import Link from 'next/link';
import { CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

interface MealPlanCardProps {
  day: string,
  recipeBreakfast: string,
  recipeLunch: string,
  recipeDinner: string,
  recipeIdBreakfast: number,
  recipeIdLunch: number,
  recipeIdDinner: number,
  onDelete: (day: string, mealType: "breakfast" | "lunch" | "dinner") => void, 
};

const MealPlanCard: FC<MealPlanCardProps> = ({ day, recipeBreakfast, recipeLunch, recipeDinner, recipeIdBreakfast, recipeIdLunch, recipeIdDinner, onDelete }) => {
  return (
  <div className='rounded-md bg-[#EFEFD0] p-2'>
    <div className="flex items-center justify-center gap-4 mb-6">
      <CarouselPrevious className="static translate-y-0 w-6 h-6" />
      <h2 className='font-parisienne text-4xl text-center mb-4'>{day}</h2>
      <CarouselNext className="static translate-y-0 w-6 h-6" />
    </div>
    <div className="grid grid-cols-3 items-center gap-y-4">
      <div className="flex flex-col justify-center">
        <h3 className="font-merriweather text-2xl mb-2">Breakfast:</h3>
        <Image
          src="/OrnamentMealPlan.png"
          alt="an ornament for the meal plan card"
          width={144}
          height={12}
        />
      </div>
      <h3 className="font-merriweather text-xl text-center">{recipeBreakfast}</h3>
       { recipeBreakfast ? 
        <div className='gap-2 flex flex-row itmes-center justify-between'>
          <Button className="font-light bg-[#004E89] text-xl text-[#EFEFD0] hover:bg-[#1A659E]"><Link href={`/recipes/${recipeIdBreakfast}`}>See recipe</Link></Button> 
          <Button className="font-light bg-[#ff1313] text-xl text-[#EFEFD0] hover:bg-[#c20d0d] cursor-pointer" onClick={() => onDelete(day, "breakfast")}>Delete</Button>
        </div> : 
        <p className='font-merriweather text-xl text-center'>
          Choose something for Breakfast
        </p>
      }

      <div className="flex flex-col justify-center">
        <h3 className="font-merriweather text-2xl mb-2">Lunch:</h3>
        <Image
          src="/OrnamentMealPlan.png"
          alt="an ornament for the meal plan card"
          width={144}
          height={12}
        />
      </div>
      <h3 className="font-merriweather text-xl text-center">{recipeLunch}</h3>
      { recipeLunch ? 
        <div className='gap-2 flex flex-row itmes-center justify-between'>
          <Button className="font-light bg-[#004E89] text-xl text-[#EFEFD0] hover:bg-[#1A659E]"><Link href={`/recipes/${recipeIdLunch}`}>See recipe</Link></Button> 
          <Button className="font-light bg-[#ff1313] text-xl text-[#EFEFD0] hover:bg-[#c20d0d] cursor-pointer" onClick={() => onDelete(day, "lunch")}>Delete</Button>
        </div> : 
        <p className='font-merriweather text-xl text-center'>
          Know your next Lunch
        </p>
      }

      <div className="flex flex-col justify-center">
        <h3 className="font-merriweather text-2xl">Dinner:</h3>
      </div>
      <h3 className="font-merriweather text-xl text-center">{recipeDinner}</h3>
      { recipeDinner ? 
        <div className='gap-2 flex flex-row itmes-center justify-between'>
          <Button className="font-light bg-[#004E89] text-xl text-[#EFEFD0] hover:bg-[#1A659E]"><Link href={`/recipes/${recipeIdDinner}`}>See recipe</Link></Button> 
          <Button className="font-light bg-[#ff1313] text-xl text-[#EFEFD0] hover:bg-[#c20d0d] cursor-pointer" onClick={() => onDelete(day, "dinner")}>Delete</Button>
        </div>  : 
        <p className='font-merriweather text-xl text-center'>
          Plan your Dinner
        </p>
      }
    </div>
  </div>
  )
};

export default MealPlanCard