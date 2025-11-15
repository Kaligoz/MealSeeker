"use client"

import { motion } from "motion/react";

interface AnimatedCardprops {
  phrase: string;
};

export default function AnimatedCard({ phrase }: AnimatedCardprops) {
    return (
        <motion.div 
            className="bg-white rounded-md p-10"
            initial={{ opacity: 0, y: 40 }}      
            animate={{ opacity: 1, y: 0 }}           
            transition={{ duration: 0.4 }}
        >
            <h2 className="text-2xl font-parisienne text-[#004E89] mr-10">Chefs note:</h2>
            <p className="text-2xl font-parisienne">{phrase}</p>
        </motion.div>
    )
}