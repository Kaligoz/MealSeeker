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
    <div className="rounded-md bg-[#EFEFD0] p-4 sm:p-6">
      <div className="flex items-center justify-center gap-4 mb-6">
        <CarouselPrevious className="static translate-y-0 w-6 h-6" />
        <h2 className="font-parisienne text-2xl sm:text-3xl md:text-4xl text-center">
          {day}
        </h2>
        <CarouselNext className="static translate-y-0 w-6 h-6" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-y-8 md:gap-y-4 md:gap-x-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <h3 className="font-merriweather text-xl md:text-2xl">Breakfast:</h3>
          <Image
            src="/OrnamentMealPlan.png"
            alt="an ornament for the meal plan card"
            width={144}
            height={12}
          />
          <h3 className="font-merriweather text-sm md:text-xl text-center">
            {recipeBreakfast}
          </h3>
          {recipeBreakfast ? (
            <div className="flex flex-col md:flex-nowrap gap-2 justify-center md:justify-between w-full">
              <Button className="font-light bg-[#004E89] text-sm md:text-xl text-[#EFEFD0] hover:bg-[#1A659E]">
                <Link href={`/recipes/${recipeIdBreakfast}`}>See recipe</Link>
              </Button>
              <Button
                className="font-light bg-[#ff1313] text-sm md:text-xl text-[#EFEFD0] hover:bg-[#c20d0d] cursor-pointer"
                onClick={() => onDelete(day, "breakfast")}
              >
                Delete
              </Button>
            </div>
          ) : (
            <p className="font-merriweather text-sm md:text-xl text-center">
              Choose something for Breakfast
            </p>
          )}
        </div>

        <div className="flex flex-col items-center md:items-start gap-2">
          <h3 className="font-merriweather text-xl md:text-2xl">Lunch:</h3>
          <Image
            src="/OrnamentMealPlan.png"
            alt="an ornament for the meal plan card"
            width={144}
            height={12}
          />
          <h3 className="font-merriweather text-sm md:text-xl text-center">
            {recipeLunch}
          </h3>
          {recipeLunch ? (
            <div className="flex flex-col md:flex-nowrap gap-2 justify-center md:justify-between w-full">
              <Button className="font-light bg-[#004E89] text-sm md:text-xl text-[#EFEFD0] hover:bg-[#1A659E]">
                <Link href={`/recipes/${recipeIdLunch}`}>See recipe</Link>
              </Button>
              <Button
                className="font-light bg-[#ff1313] text-sm md:text-xl text-[#EFEFD0] hover:bg-[#c20d0d] cursor-pointer"
                onClick={() => onDelete(day, "lunch")}
              >
                Delete
              </Button>
            </div>
          ) : (
            <p className="font-merriweather text-sm md:text-xl text-center">
              Know your next Lunch
            </p>
          )}
        </div>

        <div className="flex flex-col items-center md:items-start gap-2">
          <h3 className="font-merriweather text-xl md:text-2xl">Dinner:</h3>
          <Image
            src="/OrnamentMealPlan.png"
            alt="an ornament for the meal plan card"
            width={144}
            height={12}
          />
          <h3 className="font-merriweather text-sm md:text-xl text-center">
            {recipeDinner}
          </h3>
          {recipeDinner ? (
            <div className="flex flex-col md:flex-nowrap gap-2 justify-center md:justify-between w-full">
              <Button className="font-light bg-[#004E89] text-sm md:text-xl text-[#EFEFD0] hover:bg-[#1A659E]">
                <Link href={`/recipes/${recipeIdDinner}`}>See recipe</Link>
              </Button>
              <Button
                className="font-light bg-[#ff1313] text-sm md:text-xl text-[#EFEFD0] hover:bg-[#c20d0d] cursor-pointer"
                onClick={() => onDelete(day, "dinner")}
              >
                Delete
              </Button>
            </div>
          ) : (
            <p className="font-merriweather text-sm md:text-xl text-center">
              Plan your Dinner
            </p>
          )}
        </div>
      </div>
    </div>
  )
};

export default MealPlanCard