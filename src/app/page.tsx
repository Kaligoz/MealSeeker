"use client"

import { useState, useEffect } from 'react';
import DishCard from '../components/DishCard';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useDebounce } from 'use-debounce';
import MealPlanCard from '@/components/MealPlanCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Recipe = {
  id: number,
  title: string,
  image: string,
  likes: number,
  missedIngredients: { name: string }[],
};

export default function Home() {

  const [ingredients, setIngredients] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem('ingredients')
      return saved ? JSON.parse(saved) : []
    }
  })

  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem('recipes')
      return saved ? JSON.parse(saved) : []
    }
  })

  const [input, setInput] = useState("")
  const [debouncedValue] = useDebounce(input, 1000);

  const addIngredient = () => {
    if (!debouncedValue) return
    setIngredients((prev) => [...prev, input])
    setInput("")
  }

  const handleinputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value)
  }

  const fetchRecipes = async () => {
    const response = await fetch(`/api/recipes?ingredients=${ingredients.join(",")}`)
    const data = await response.json()
    setRecipes(data)
  }

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  useEffect(() => {
    if(ingredients.length < 3) {
      fetchRecipes()
    }
  }, [ingredients])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("recipes", JSON.stringify(recipes))
    }
  },[recipes])
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("ingredients", JSON.stringify(ingredients))
    }
  }, [ingredients])

  return (
    <main className='grid grid-cols-3'>
      <section className="sticky top-0 h-screen bg-[url('/Background.png')] bg-no-repeat bg-center bg-cover p-10 col-span-1">
        <div className='mb-6'>
          <h1 className="font-merriweather text-4xl font-bold mb-8">Welcome to <span className="font-parisienne text-[#1A659E]">MealSeeker!</span></h1>
          <p className="font-merriweather text-2xl">
            Enter the ingredients you have.<br/>
            We’ll show recipes you can make.<br/> 
            Everyone knows the cooking struggle.<br/>
            Let’s find your perfect meal together!
          </p>
        </div>
        <div className='border border-[#828181] rounded-md bg-white flex flex-row items-center w-fit mb-6'>
          <input 
            value={input}
            type="text"
            placeholder= "Enter an ingredient..."
            onChange={handleinputChange} 
            className='text-[#828181] text-2xl mr-20 px-2 py-0.5 outline-none'
          />
          <Button onClick={addIngredient} className='font-light text-xl bg-[#004E89] text-[#EFEFD0] cursor-pointer hover:bg-[#1A659E] mx-0.5 my-0.5'>Add</Button>
        </div>
        <div className='mb-6 gap-2 flex flex-wrap max-w-full'>
          {ingredients.map((ing, i) => 
            <div key={i} className='border border-[#9E9E9E] bg-white rounded-md px-2 w-fit flex flex-row itmes-center'>
              <h3 className=' text-lg font-light pr-3'>{ing}</h3>
              <button onClick={() => removeIngredient(i)} className='cursor-pointer text-[#9E9E9E]'><X /></button>
            </div>
          )}
        </div>
        <div>
          <Carousel>
            <CarouselContent>
              <CarouselItem>
                <MealPlanCard
                  day="Monday"
                  recipeBreakfast="Pancakes"
                  recipeLunch="Chicken Salad"
                  recipeDinner="Pasta"
                  recipeIdBreakfast={1}
                  recipeIdLunch={2}
                  recipeIdDinner={3}
                />
              </CarouselItem>

              <CarouselItem>
                <MealPlanCard
                  day="Tuesday"
                  recipeBreakfast="Omelette"
                  recipeLunch="Soup"
                  recipeDinner="Steak"
                  recipeIdBreakfast={4}
                  recipeIdLunch={5}
                  recipeIdDinner={6}
                />
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>
      </section>
      <section className='max-h-screen overflow-y-scroll p-4 col-span-2 no-scrollbar'>
          {recipes.map((r) => (
            <div key={r.id}>
              <DishCard  
                title={r.title}
                image={r.image} 
                likes={r.likes}
                missingIng={r.missedIngredients?.map((ing) => ing.name) || []}
                id={r.id}
              />
            </div>
          ))}
      </section>
    </main>
  )
};