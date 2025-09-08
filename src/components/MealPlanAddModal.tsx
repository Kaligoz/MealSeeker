import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";

type Recipe = {
  id: number,
  title: string,
  image: string,
  likes: number,
  missedIngredients: { name: string }[],
};

type MealPlanAddModalProps = {
    isOpen: boolean;
    onClose: () => void;
    dish: Recipe | null;
    onSave: (day: string, mealType: "breakfast" | "lunch" | "dinner", dish: Recipe) => void; 
    currentMeals?: {
        breakfast?: Recipe;
        lunch?: Recipe;
        dinner?: Recipe;
    }  
}

export default function MealPlanAddModal({ isOpen, onClose, dish, onSave, currentMeals }: MealPlanAddModalProps) {

    const modalRef = useRef<HTMLDivElement>(null)
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const days = ["Mn","Tu","We","Th","Fr","Sa","Su"]

    const dayMap: Record<string, string> = {
        Mn: "Monday",
        Tu: "Tuesday",
        We: "Wednesday",
        Th: "Thursday",
        Fr: "Friday",
        Sa: "Saturday",
        Su: "Sunday",
    }

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
                className={`w-12 h-12 flex items-center justify-center border border-black rounded-full text-xl font-light font-merriweather ${
                    selectedDay === day
                    ? "bg-[#004E89] text-[#EFEFD0]"
                    : "bg-[#EFEFD0] text-black hover:bg-[#D5D5BB]"
                }`}
                >
                {day}
                </Button>
            ))}
            </div>

            {["breakfast", "lunch", "dinner"].map((mealType) => (
            <div key={mealType} className="flex flex-col mb-4">
                <h4 className="text-2xl text-black font-parisienne capitalize">
                {mealType}:
                </h4>

                {currentMeals?.[mealType as "breakfast" | "lunch" | "dinner"] ? (
                <div className="flex items-center gap-3 mt-2">
                    <Image
                    src={
                        currentMeals[mealType as "breakfast" | "lunch" | "dinner"]
                        ?.image || "/placeholder.png"
                    }
                    alt={
                        currentMeals[mealType as "breakfast" | "lunch" | "dinner"]
                        ?.title || "Meal"
                    }
                    width={50}
                    height={50}
                    className="rounded-md"
                    />
                    <p className="text-lg">
                    {
                        currentMeals[mealType as "breakfast" | "lunch" | "dinner"]
                        ?.title
                    }
                    </p>
                    <Button
                    disabled={!selectedDay || !dish}
                    onClick={() =>
                        dish &&
                        selectedDay &&
                        onSave(dayMap[selectedDay], mealType as "breakfast" | "lunch" | "dinner", dish)
                    }
                    className="ml-auto bg-[#004E89] text-[#EFEFD0] hover:bg-[#1A659E]"
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
                        onSave(
                        dayMap[selectedDay], 
                        mealType as "breakfast" | "lunch" | "dinner",
                        dish
                        )
                    }
                    className="mt-2 bg-[#004E89] text-[#EFEFD0] hover:bg-[#1A659E]"
                    >
                    Add
                </Button>
                )}
            </div>
            ))}
        </div>
        </div>
    )
};
