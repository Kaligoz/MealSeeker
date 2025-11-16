import { Clock, Utensils  } from "lucide-react";
import { toast } from "sonner"
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import phrases from "@/lib/phrases.json";
import striptags from "striptags";
import AnimatedCard from "@/components/AnimatedCard";

interface RecipePageProps {
  params: Promise<{ slug: string }>;
};

type Ingredient = {
  id: number,
  original: string,
  [key: string]: unknown,
};

export default async function RecipePage({ params }: RecipePageProps) {
    const { slug } = await params

    const randomIndex = Math.floor(Math.random() * phrases.phrases.length)
    const phrase = phrases.phrases[randomIndex]

    const apiKey = process.env.SPOONACULAR_API_KEY

    const res = await fetch(
        `https://api.spoonacular.com/recipes/${slug}/information?apiKey=${apiKey}`,
        { cache: "no-store" }
    );

    if (!res.ok) {
        toast.error("There has been an error.", {
            description: `Please try and reload the page. Error: ${res}`
        })
    }

    const data = await res.json()   

    function cleanText(text?: string) {
        if (!text) return ''
        return striptags(text)
    }

    return (
         <main className="md:grid md:grid-cols-2 md:gap-8 gap-0 flex flex-col">
            <section className="p-4 flex flex-col items-center">
                <Link href="/" className="w-full">
                    <Button className="font-light text-xl bg-[#004E89] text-[#EFEFD0] cursor-pointer hover:bg-[#1A659E] w-full mb-6">
                        Back
                    </Button>
                </Link>
                <div className="relative ml-2 mb-6 xl:w-[700px] xl:h-[500px] lg:w-[550px] lg:h-[400px] md:w-[375px] md:h-[300px] w-[350px] h-[250px]">
                    <Image 
                        src={data.image}
                        alt={data.title}
                        fill 
                        className="object-cover rounded-md" 
                    />
                    <div className="absolute top-0 left-0 w-10 h-10 rounded-br-full bg-[#EFEFD0]"></div>
                    <div className="absolute top-0 right-0 w-10 h-10 rounded-bl-full bg-[#EFEFD0]"></div>
                    <div className="absolute bottom-0 left-0 w-10 h-10 rounded-tr-full bg-[#EFEFD0]"></div>
                    <div className="absolute bottom-0 right-0 w-10 h-10 rounded-tl-full bg-[#EFEFD0]"></div>
                </div>
                <div className="flex flex-row gap-15 mb-6">
                    <p className="flex flex-row justify-center items-center gap-1.5 font-merriweather"><span><Clock /></span>{data.readyInMinutes} minutes</p>
                    <p className="flex flex-row justify-center items-center gap-1.5 font-merriweather"><span><Utensils /></span>{data.servings} servings</p>
                </div>
                <div className="relative w-[500px">
                    <Image src="/PaperClip.png" alt="A paper clip to hold down the chefs note." width={30} height={50} className="absolute -top-3 left-4"/>
                    <AnimatedCard phrase={phrase} />
                </div>
            </section>
            <section className="relative flex flex-col items-center gap-4 md:bg-[url('/Background.png')] md:bg-no-repeat md:bg-center md:bg-cover py-4 px-16 h-screen">
                <div className="absolute left-0 top-0 h-full xl:w-20 xl:pointer-events-none xl:bg-gradient-to-r xl:from-[#EFEFD0] xl:to-transparent"></div>
                <h1 className="md:text-4xl text-2xl font-merriweather mb-6">{data.title}</h1>
                <div className="flex flex-col justify-center items-center mb-6">
                    <Image src="/Ornament.png" alt="An ornament" width={300} height={200} className="mb-4"/>
                    <h2 className="md:text-4xl text-2xl font-parisienne text-[#004E89] mb-6">Ingredients</h2>
                    <div className="list-disc pl-5">
                        {data.extendedIngredients.map((ing: Ingredient, index: number) => (
                        <li key={`${ing.id}-${index}`} className="mb-1 font-merriweather md:text-base text-sm">
                            {ing.original}
                        </li>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <Image src="/Ornament.png" alt="Nutella Stuffed French Toast" width={300} height={200} className="mb-4"/>
                    <h2 className="md:text-4xl text-2xl font-parisienne text-[#004E89] mb-6">Instructions</h2>
                    <p className="md:text-base text-sm font-merriweather">{cleanText(data?.instructions)}</p>
                </div>
            </section>   
        </main>
    )
};