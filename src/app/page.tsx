"use client"

import { useState, useEffect } from 'react';
import DishCard from '../components/DishCard';
import { Button } from '@/components/ui/button';
import { useDebounce } from 'use-debounce';
import MealPlanCard from '@/components/MealPlanCard';
import MealPlanAddModal from '@/components/MealPlanAddModal';
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";

type Recipe = {
  id: number,
  title: string,
  image: string,
  likes: number,
  missedIngredients: { name: string }[],
};

export default function Home() {

  const [input, setInput] = useState("")

  const [debouncedValue] = useDebounce(input, 1000)

  const [ingredients, setIngredients] = useState<string[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])

  const [openModal, setOpenModal] = useState<string | null>(null)
  const [selectedDish, setSelectedDish] = useState<Recipe | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mealPlan, setMealPlan] = useState<Record<string, any>>({})

  useEffect(() => {
    const savedIng = localStorage.getItem("ingredients")
    const savedRec = localStorage.getItem("recipes")

    if (savedIng) {
      try {
        const parsed = JSON.parse(savedIng)
        if (Array.isArray(parsed)) {
          setIngredients(parsed)
        }
      } catch {
        setIngredients([])
      }
    }

    if (savedRec) {
      try {
        const parsed = JSON.parse(savedRec)
        if (Array.isArray(parsed)) {
          setRecipes(parsed)
        } else {
          setRecipes([])
        }
      } catch {
        setRecipes([])
      }
    }
  }, [])

  const fetchRecipes = async () => {
    try {
      const response = await fetch(`/api/recipes?ingredients=${ingredients.join(",")}`)
      const data = await response.json()
      if (Array.isArray(data)) {
          setRecipes(data)
        } else {
          console.error("Unexpected API response:", data)
          setRecipes([]) 
        }
    } catch (err) {
      console.error("Failed to fetch recipes:", err)
      setRecipes([])
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("recipes", JSON.stringify(recipes))
    }
  },[recipes])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("ingredients", JSON.stringify(ingredients))
    }

    if(ingredients.length >= 3) {
      fetchRecipes()
    } else {
      setRecipes([]) 
    }
  }, [ingredients])

  useEffect(() => {
    const savedPlan = localStorage.getItem("mealPlan")
    if (savedPlan) setMealPlan(JSON.parse(savedPlan))
  }, [])

  const addIngredient = () => {
    if (!debouncedValue) return
    setIngredients((prev) => [...prev, input])
    setInput("")
  }

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const handleinputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value)
  }

  const handleOpen = (dish: Recipe) => {
    setOpenModal('mealPlanAdd')
    setSelectedDish(dish)
  }

  const handleClose = () => setOpenModal(null)

  const handleSaveMealPlan = (
    day: string,
    mealType: "breakfast" | "lunch" | "dinner",
    dish: Recipe
  ) => {
    const updatedPlans = {
      ...mealPlan,
      [day]: {
        ...mealPlan[day],
        [mealType]: {
          id: dish.id,
          title: dish.title,
          image: dish.image,
        },
      },
    }

    setMealPlan(updatedPlans)
    localStorage.setItem("mealPlan", JSON.stringify(updatedPlans))
    setOpenModal(null)
  }


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
          <Button 
            onClick={addIngredient} 
            className='font-light text-xl bg-[#004E89] text-[#EFEFD0] cursor-pointer hover:bg-[#1A659E] mx-0.5 my-0.5'>
            Add
          </Button>
        </div>
        <div className='mb-6 gap-2 flex flex-wrap max-w-full'>
          {ingredients.map((ing, i) => 
            <div key={i} className='border border-[#9E9E9E] bg-white rounded-md px-2 w-fit flex flex-row itmes-center'>
              <h3 className=' text-lg font-light pr-3'>{ing}</h3>
              <button onClick={() => removeIngredient(i)} className='cursor-pointer text-[#9E9E9E]'>✕</button>
            </div>
          )}
        </div>
        <div>
          <Carousel>
            <CarouselContent>
              {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map((day) => (
                <CarouselItem key={day}>
                  <MealPlanCard
                    day={day}
                    recipeBreakfast={mealPlan[day]?.breakfast?.title || ""}
                    recipeLunch={mealPlan[day]?.lunch?.title || ""}
                    recipeDinner={mealPlan[day]?.dinner?.title || ""}
                    recipeIdBreakfast={mealPlan[day]?.breakfast?.id || 0}
                    recipeIdLunch={mealPlan[day]?.lunch?.id || 0}
                    recipeIdDinner={mealPlan[day]?.dinner?.id || 0}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>
      <section className='col-span-2 ml-16 h-screen'>
        <h1 className='font-merriweather text-3xl mb-4 pt-4'>Found <span className='text-[#004E89]'>{recipes.length} meals</span> from your fridge:</h1>
        <div className='h-[calc(100vh-5rem)] overflow-y-auto p-4 no-scrollbar'>
          {recipes.map((r) => (
            <div key={r.id}>
              <DishCard  
                title={r.title}
                image={r.image} 
                likes={r.likes}
                missingIng={r.missedIngredients?.map((ing) => ing.name) || []}
                id={r.id}
                onClick={() => handleOpen(r)}
              />
            </div>
          ))}
        </div>
      </section>
      <MealPlanAddModal isOpen={openModal === 'mealPlanAdd'} onClose={handleClose} dish={selectedDish} onSave={handleSaveMealPlan}/>
    </main>
  )
};