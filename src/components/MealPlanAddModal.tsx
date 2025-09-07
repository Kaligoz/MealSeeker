import { useEffect, useRef } from "react";
import { Button } from "./ui/button";

type MealPlanAddModalProps = {
    isOpen: boolean;
    onClose: () => void;
}



export default function MealPlanAddModal({ isOpen, onClose }: MealPlanAddModalProps) {
    const modalRef = useRef<HTMLDivElement>(null)

    const days = ["Mn","Tu","We","Th","Fr","Sa","Su"]

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
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black backdrop-opacity-50 transition-opacity duration-300 ${
            isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}>
            <div ref={modalRef} className="bg-[#EFEFD0] rounded-xl p-6 relative min-w-[300px]">

            <Button onClick={onClose} className="absolute top-2 right-2 cursor-pointer bg-[#EFEFD0] hover:text-black hover:bg-[#EFEFD0] text-black font-bold border-none">
                ✕
            </Button>

            <div className="flex flex-row mt-8 gap-4 mb-4">
                {days.map((day, i) => 
                    <Button key={i} className="w-12 h-12 flex items-center justify-center border border-black rounded-full text-xl font-merriweather font-light bg-[#EFEFD0] text-black hover:bg-[#D5D5BB] cursor-pointer">
                        {day}
                    </Button>
                )}
            </div>

            <div className="flex flex-col">
                <h4 className="text-3xl text-black font-parisienne">Breakfast:</h4>
            </div>

            <div className="flex flex-col">
                <h4 className="text-3xl text-black font-parisienne">Lunch:</h4>
            </div>

            <div className="flex flex-col">
                <h4 className="text-3xl text-black font-parisienne">Dinner:</h4>
            </div>

            </div>
        </div>
    )
};