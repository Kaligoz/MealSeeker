"use client"

import { useState, useEffect } from 'react';
import DishCard from '../components/DishCard';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

type Recipe = {
  id: number;
  title: string;
  image: string;
  likes: number;
  missedIngredients: { name: string }[];
};

export default function Home() {

  const [ingredients, setIngredients] = useState<string[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [input, setInput] = useState("")
  const apiKey = process.env.SPOONACULAR_API_KEY

  useEffect(() => {
    if(ingredients.length < 3) return

    const handler = setTimeout(() => {
      fetchRecipes()
    }, 2500)

    return () => clearTimeout(handler)
  }, [ingredients])

  useEffect(() => {
    const cachedRecipes = localStorage.getItem("recipes")
    const cachedIngredients = localStorage.getItem("ingredients")
    
    if(cachedRecipes) {
      setRecipes(JSON.parse(cachedRecipes))
      console.log("parsed recipes")
    }
    if(cachedIngredients) {
      setIngredients(JSON.parse(cachedIngredients))
      console.log("parsed ingredient")
    }
  }, [])

  useEffect(() => {
    if (recipes.length > 0) {
      console.log("stored recipes")
      localStorage.setItem("recipes", JSON.stringify(recipes));
    }
  },[recipes])

  useEffect(() => {
    if (ingredients.length > 0) {
      console.log("stored ingredients") 
      localStorage.setItem("ingredients", JSON.stringify(ingredients))
    }
  }, [ingredients])

  const addIngredient = () => {
    if (!input) return
    setIngredients((prev) => [...prev, input])
    setInput("")
  }

  const fetchRecipes = async () => {
    const response = await fetch(`/api/recipes?ingredients=${ingredients.join(",")}&apiKey=${apiKey}`)
    const data = await response.json()
    setRecipes(data.results ?? data);
  }

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  return (
    <main className='grid grid-cols-3'>
      <section className="sticky top-0 h-screen bg-[url('/Background.png')] bg-no-repeat bg-center bg-cover p-2 col-span-1">
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
            placeholder= "Enter an ingredient..."
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' ? addIngredient() : null}
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
      </section>
      <section className='max-h-screen overflow-y-scroll p-4 col-span-2 no-scrollbar'>
          {recipes.map((r) => (
            <div key={r.id}>
              <DishCard  
                title={r.title}
                image={r.image} 
                likes={r.likes}
                missingIng={r.missedIngredients.map((ing) => ing.name).join(", ")}
                id={r.id}
              />
            </div>
          ))}
      </section>
    </main>
  );
}
