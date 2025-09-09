import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";

type MealPlanAddModalProps = {
    isOpen: boolean;
    onClose: () => void;
    dish: Recipe | null;
    onSave: (day: string, mealType: "breakfast" | "lunch" | "dinner", dish: Recipe) => void; 
    currentMeals?: WeaklyMealPlan;
}

type Recipe = {
  id: number,
  title: string,
  image: string,
  likes: number,
  missedIngredients: { name: string }[],
};

type WeaklyMealPlan = {
    [day: string]: {
        breakfast?: Recipe;
        lunch?: Recipe;
        dinner?: Recipe;
    }
};

export default function MealPlanAddModal({ isOpen, onClose, dish, onSave, currentMeals }: MealPlanAddModalProps) {

    const modalRef = useRef<HTMLDivElement>(null)
    const [selectedDay, setSelectedDay] = useState<string | null>(null)
    const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
            onClose()
        }
        }

        const handleClickOutside = (event: MouseEvent) => {
        if (
            modalRef.current &&
            !modalRef.current.contains(event.target as Node)
        ) {
            onClose()
        }
        }

        if (isOpen) {
            window.addEventListener("keydown", handleKeyDown)
            window.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            window.removeEventListener("keydown", handleKeyDown)
            window.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen, onClose])

    return(
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}>
            <div ref={modalRef} className="bg-[#EFEFD0] rounded-xl p-6 relative min-w-[300px]">

            <Button onClick={onClose} className="absolute top-2 right-2 cursor-pointer bg-[#EFEFD0] hover:text-black hover:bg-[#EFEFD0] text-black font-bold border-none">
                ✕
            </Button>

            <div className="flex flex-row mt-6 gap-2 mb-6 flex-wrap">
            {days.map((day) => (
                <Button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex items-center justify-center border border-black rounded-full text-xl font-light font-merriweather bg-[#EFEFD0] text-black hover:bg-[#b3b39c] cursor-pointer ${
                    selectedDay === day 
                    ? 'bg-[#b3b39c]' 
                    : ''
                }`}
                >
                {day}
                </Button>
            ))}
            </div>

            {["breakfast", "lunch", "dinner"].map((mealType) => {
                const meal = selectedDay
                    ? currentMeals?.[selectedDay]?.[mealType as "breakfast" | "lunch" | "dinner"]
                    : undefined;

                return (
                    <div key={mealType} className="flex flex-col mb-4">
                    <h4 className="text-4xl text-black font-parisienne capitalize">
                        {mealType}:
                    </h4>

                    {meal ? (
                        <div className="flex items-center gap-3 mt-2">
                        <Image
                            src={meal.image}
                            alt={meal.title}
                            width={200}
                            height={100}
                            className="rounded-md"
                        />
                        <p className="text-2xl font-merriweather">{meal.title}</p>
                        <Button
                            disabled={!selectedDay || !dish}
                            onClick={() =>
                            dish &&
                            selectedDay &&
                            onSave(selectedDay, mealType as "breakfast" | "lunch" | "dinner", dish)
                            }
                            className="ml-auto bg-[#004E89] text-[#EFEFD0] hover:bg-[#1A659E] text-xl cursor-pointer"
                        >
                            Change
                        </Button>
                        </div>
                    ) : (
                        <Button
                        disabled={!selectedDay || !dish}
                        onClick={() =>
                            dish &&
                            selectedDay &&
                            onSave(selectedDay, mealType as "breakfast" | "lunch" | "dinner", dish)
                        }
                        className="mt-2 bg-[#004E89] text-[#EFEFD0] hover:bg-[#1A659E] text-xl cursor-pointer"
                        >
                        Add
                        </Button>
                    )}
                    </div>
                );
            })}
            </div>
        </div>
    )
};
