"use client"

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useDebounce } from 'use-debounce';
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";
import { toast } from "sonner"
import { motion, AnimatePresence } from "motion/react";
import MealPlanCard from '@/components/MealPlanCard';
import MealPlanAddModal from '@/components/MealPlanAddModal';
import DishCard from '../components/DishCard';
import Image from 'next/image';
import { ingredientList } from '@/lib/ingredients';
import StreakAnimationModal from '@/components/StreakAnimationModal';

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
  const [suggestions, setSuggestions] = useState<string[]>([])

  const [ingredients, setIngredients] = useState<string[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [hasLoaded, setHasLoaded] = useState(false)

  const [streak, setStreak] = useState<number>(0)
  const [openModal, setOpenModal] = useState<string | null>(null)
  const [openStreakModal, setOpenStreakModal] = useState<string | null>(null)
  const [selectedDish, setSelectedDish] = useState<Recipe | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mealPlan, setMealPlan] = useState<Record<string, any>>({})

  const wrapperRef = useRef<HTMLDivElement>(null)

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const savedIngredients = JSON.parse(localStorage.getItem("ingredients") || "[]")
      const savedRecipes = JSON.parse(localStorage.getItem("recipes") || "[]")
      const savedPlan = JSON.parse(localStorage.getItem("mealPlan") || "{}")
      const savedStreak = JSON.parse(localStorage.getItem("streak") || "null")

      if (Array.isArray(savedIngredients)) setIngredients(savedIngredients)
      if (Array.isArray(savedRecipes)) setRecipes(savedRecipes)
      if (savedPlan && typeof savedPlan === "object") setMealPlan(savedPlan)
      if (savedStreak) setStreak(savedStreak.currentStreak || 0)
      else setStreak(0)
    } catch (err) {
      console.error("Error loading from localStorage:", err)
    } finally {
      setHasLoaded(true)
    }
  }, [])

  // Persist to localStorage
  useEffect(() => {
    if (hasLoaded) {
      localStorage.setItem("ingredients", JSON.stringify(ingredients))
    }
  }, [ingredients, hasLoaded])

  useEffect(() => {
    if (hasLoaded) {
      localStorage.setItem("recipes", JSON.stringify(recipes))
    }
  }, [recipes, hasLoaded])

  useEffect(() => {
    if (hasLoaded) {
      localStorage.setItem("mealPlan", JSON.stringify(mealPlan))
    }
  }, [mealPlan, hasLoaded])

  // Fetch recipes when ingredients change
  useEffect(() => {
    if (!hasLoaded || ingredients.length < 3) return

    const fetchRecipes = async () => {

      let apiUrl = `/api/recipes?ingredients=${ingredients.join(",")}`

      if (streak <= 2) apiUrl += "&maxReadyTime=20$sort=popularity"
      else if (streak <= 6) apiUrl += "&maxReadyTime=40&sort=healthiness"
      else apiUrl += "&sort=random&cuisine=asian,italian,mexican"

      try {
        const response = await fetch(apiUrl)
        const data = await response.json()
        if (Array.isArray(data)) {
          setRecipes(data)
        }
      } catch (err) {
        console.error("Failed to fetch recipes:", err)
      }
    }

    fetchRecipes()
  }, [ingredients, hasLoaded])

  // Ingredient management
  const addIngredient = () => {
    const value = debouncedValue.trim()

    if (!value) return

    if (value.includes(",") || value.split(" ").length > 2) {
      toast.error("Please add one ingredient at a time.")
      return
    } else if (ingredients.includes(value.toLowerCase())) {
      toast.error("This ingredient is already in the list.")
      return
    } else if (!/^[a-zA-Z\s-]+$/.test(value)) {
      toast.error("Only letters are allowed")
      return
    }

    const streakData = localStorage.getItem("streak")
      ? JSON.parse(localStorage.getItem("streak")!)
      : null

    if (!streakData) {
      startStreak()
    } else {
      updateStreak()
    }

    setIngredients((prev) => [...prev, debouncedValue.trim()])
    setInput("")
  }

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const handleinputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setInput(value)

    if (value.trim().length === 0) {
      setSuggestions([])
      return
    }

    if (ingredients.includes(value.toLowerCase())) {
      setSuggestions([]);
      return;
    }

    const filtered = ingredientList
      .filter(item =>
        item.toLowerCase().startsWith(value.toLowerCase()) &&
        !ingredients.includes(item.toLowerCase())
      )
      .slice(0, 6)

    setSuggestions(filtered)
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setSuggestions([])
      }
    }

    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setSuggestions([])
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEsc)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEsc)
    }
  }, [])

  // Meal plan management
  const handleOpen = (dish: Recipe) => {
    setOpenModal("mealPlanAdd")
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
    setOpenModal(null)
  }

  const handleDeleteMealFromPlan = (
    day: string,
    mealType: "breakfast" | "lunch" | "dinner"
  ) => {
    const updatedPlan = {
      ...mealPlan,
      [day]: {
        ...mealPlan[day],
        [mealType]: undefined,
      },
    }

    setMealPlan(updatedPlan)
  }

  // Streak logic
  function getTodayKey() {
    return new Date().toISOString().split("T")[0]
  }

  function startStreak() {
    const today = getTodayKey()
    const streakData = {
      currentStreak: 1,
      lastActiveDate: today,
    }
    localStorage.setItem("streak", JSON.stringify(streakData))
    setStreak(streakData.currentStreak)
    return streakData
  }

  function updateStreak() {
    const today = getTodayKey()
    const streakData =
      JSON.parse(localStorage.getItem("streak") || "null") || {
        currentStreak: 0,
        lastActiveDate: null,
      }

    if (streakData.lastActiveDate === today) return streakData

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayKey = yesterday.toISOString().split("T")[0]

    if (streakData.lastActiveDate === yesterdayKey) {
      streakData.currentStreak += 1
    } else {
      streakData.currentStreak = 1
    }

    if ([1, 3, 7].includes(streakData.currentStreak)) {
      setOpenStreakModal("streakAnimationModal")
    }

    streakData.lastActiveDate = today
    localStorage.setItem("streak", JSON.stringify(streakData))
    setStreak(streakData.currentStreak)
    return streakData
  }

  function getStreakMessage(streak: number) {
    if (streak <= 2) {
      return `Great start! Since you’re on day ${streak}, you’ll be getting quick and popular recipes to keep the momentum going.`;
    } else if (streak <= 6) {
      return `Congrats on day ${streak}! Your recipes are now getting slightly harder and a whole lot healthier.`;
    } else {
       return `Amazing! Day ${streak}! You’ve unlocked diverse world cuisines — Asian, Italian, Mexican and more!`;
    }
  }

  const handleCloseStreakModal = () => setOpenStreakModal(null)

  return (
    <main className='xl:grid xl:grid-cols-3 flex flex-col min-h-screen'>
      <section className="relative xl:sticky xl:top-0 xl:h-screen xl:bg-[url('/Background.png')] xl:bg-no-repeat xl:bg-center xl:bg-cover p-6 sm:p-8 md:p-10">
        <div className="absolute right-0 top-0 h-full xl:w-20 xl:pointer-events-none xl:bg-gradient-to-r xl:from-transparent xl:via-[#EFEFD0]/80 xl:to-[#EFEFD0]"></div>
        <div className='mb-6'>
          <h1 className="font-merriweather text-4xl font-bold mb-8">Welcome to <span className="font-parisienne text-[#1A659E]">MealSeeker!</span></h1>
          <p className="font-merriweather text-xl">
            Enter the ingredients you have.<br/>
            We’ll show you recipes you can cook.<br/> 
            Keep your streak alive by coming back every day.<br/>
            Let’s find your perfect meal together! 
          </p>
        </div>
        <div className='font-merriweather text-2xl mb-6'>
          <h3>Your streak: 🔥{streak}</h3>
        </div>
        <div className='relative border border-[#828181] rounded-md bg-white flex flex-row items-center w-fit mb-6'>
          <div ref={wrapperRef} className="relative">
            <input 
              value={input}
              type="text"
              placeholder= "Enter an ingredient..."
              onChange={handleinputChange} 
              onKeyDown={(e) => {
                if (e.key === "Enter") addIngredient()
              }}
              className='text-[#828181] md:text-2xl text-xl px-2 py-0.5 outline-none'
            />
            {suggestions.length > 0 && (
              <ul className="absolute left-0 top-full w-full bg-white border border-gray-300 rounded-md shadow-lg z-30 max-h-48 overflow-y-auto">
                {suggestions.map((item) => (
                  <li
                    key={item}
                    onClick={() => {
                      setSuggestions([])
                      setIngredients(prev => [...prev, item.toLowerCase()])
                      setInput("")
                    }}
                    className="p-2 cursor-pointer hover:bg-gray-100"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <Button 
            onClick={() => {
              addIngredient()
              setSuggestions([])
            }} 
            className='font-light text-xl bg-[#004E89] text-[#EFEFD0] cursor-pointer hover:bg-[#1A659E] mx-0.5 my-0.5'>
            Add
          </Button>
        </div>
        <div className='mb-6 gap-2 flex flex-wrap max-w-full'>
          <AnimatePresence>
            {ingredients.map((ing, i) => 
              <motion.div 
                key={ing} 
                className='border border-[#9E9E9E] bg-white rounded-md px-2 w-fit flex flex-row itmes-center'
                initial={{ opacity: 0, y: -20 }}      
                animate={{ opacity: 1, y: 0 }}       
                exit={{ opacity: 0, y: -20 }}      
                transition={{ duration: 0.2 }}
              >
                <h3 className=' text-lg font-light pr-3'>{ing}</h3>
                <button onClick={() => removeIngredient(i)} className='cursor-pointer text-[#9E9E9E]'>✕</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}      
          animate={{ opacity: 1, y: 0 }}     
          transition={{ duration: 0.5 }}       
        >
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
                    onDelete={handleDeleteMealFromPlan}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </motion.div>
      </section> 
      
      <section className='xl:col-span-2 ml-0 xl:pl-16 h-auto min-h-screen mt-40 xl:mt-0 p-2 xl:p-0 flex flex-col'>
        <h1 className='font-merriweather text-3xl mb-4 pt-6 sm:pt-8 md:pt-10'>Found <span className='text-[#004E89]'>{recipes.length} meals</span> from your fridge:</h1>
        { recipes.length > 0 ? (
          <div className='flex-1 overflow-y-auto p-4 no-scrollbar'>
            {recipes.map((r, i) => {

              const have = ingredients.length
              const total = have + r.missedIngredients.length
              const match = total > 0 ? Math.round((have / total) * 100) : 0

              return (
                <motion.div 
                  key={r.id}
                  initial={{ opacity: 0, scale: 0 }}      
                  animate={{ opacity: 1, scale: 1 }}       
                  exit={{ opacity: 0, scale: 0 }}      
                  transition={{
                    duration: 0.4,
                    delay: i * 0.2, 
                  }}
                >
                  <DishCard  
                    title={r.title}
                    image={r.image} 
                    likes={r.likes}
                    missingIng={r.missedIngredients?.map((ing) => ing.name) || []}
                    matchPercent={match}
                    id={r.id}
                    onClick={() => handleOpen(r)}
                  />
                </motion.div>
              )
            })}
          </div>
         ) : (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <motion.div
              animate={{ x: [0, 10, -10, 0]}}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Image 
                src="/mangGlass.png"
                alt="A mangifing Glass"
                width={144}
                height={144}
              />
            </motion.div>
            <h3 className="text-2xl font-merriweather">
              To begin please enter at 
              <span className='text-[#004E89]'> least 3 </span>
              ingrediens
            </h3>
          </div>
        )}
        
      </section>
      <MealPlanAddModal isOpen={openModal === 'mealPlanAdd'} onClose={handleClose} dish={selectedDish} onSave={handleSaveMealPlan} currentMeals={mealPlan}/>
      <StreakAnimationModal isOpen={openStreakModal === 'streakAnimationModal'} onClose={handleCloseStreakModal} dayText={getStreakMessage(streak)} streakNumber={streak}/>
    </main>
  )
};