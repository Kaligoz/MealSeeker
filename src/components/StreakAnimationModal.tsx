import { useEffect, useRef} from "react";
import { motion, AnimatePresence } from "motion/react";

type StreakAnimationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    streakNumber: number;
    dayText: string;
}


export default function StreakAnimationModal({ isOpen, onClose, streakNumber, dayText }: StreakAnimationModalProps) {

    const modalRef = useRef<HTMLDivElement>(null)

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
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    className="fixed inset-0 bg-black/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="z-50 flex items-center justify-center h-full p-4 md:p-8"
                        initial={{ opacity: 0, scale: 0.9 }}      
                        animate={{ opacity: 1, scale: 1 }}       
                        exit={{ opacity: 0, scale: 0.9 }}      
                        transition={{ duration: 0.4 }}
                    >
                        <div ref={modalRef} className="flex flex-col items-center justify-center">

                        <motion.p 
                            className="text-6xl mb-4"
                            initial={{ opacity: 0, scale: 0, rotateY: 0}}
                            animate={{ opacity: 1, scale: 1, rotateY: 360 }}
                            exit={{ opacity: 0, scale: 0, rotateY: 0 }}
                            transition={{ duration: 1}}
                        >🔥</motion.p>
                        <h1 className="text-white font-merriweather text-3xl mb-4">{streakNumber}</h1>
                        <p className="text-white font-merriweather text-lg w-1/2 text-center">{dayText}</p>    
                         
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
};