import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Clock, Utensils  } from "lucide-react";
import phrases from "@/lib/phrases.json";

interface RecipePageProps {
  params: Promise<{ slug: string }>;
}

type Ingredient = {
  id: number;
  original: string;
  [key: string]: unknown;
};

export default async function RecipePage({ params }: RecipePageProps) {
    const { slug } = await params;

    const randomIndex = Math.floor(Math.random() * phrases.phrases.length);
    const phrase = phrases.phrases[randomIndex];

    const apiKey = process.env.SPOONACULAR_API_KEY
    const res = await fetch(
        `https:api.spoonacular.com/recipes/${slug}/information?apiKey=${apiKey}`,
        { cache: "no-store" }
    );

    if (!res.ok) {
        return (
            <div>
                <h1>There has been an error. Please try and reload the page.</h1>
                <p>Status: {res.status}</p>
            </div>
        ) 
    }

    const data = await res.json();

    return (
         <main className="grid grid-cols-2 gap-8">
            <section className="p-4 flex flex-col items-center">
                <Button className="font-light text-xl bg-[#004E89] text-[#EFEFD0] cursor-pointer hover:bg-[#1A659E] w-full mb-6"><Link href="/">Back</Link></Button>
                <div className="relative mb-6 w-[500px] h-[300px]">
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
                    <div className="bg-white rounded-md p-10">
                        <h2 className="text-2xl font-parisienne text-[#004E89] mr-10">Chefs note:</h2>
                        <p className="text-2xl font-parisienne">{phrase}</p>
                    </div>
                </div>
            </section>
            <section className="flex flex-col items-center gap-4 bg-[url('/Background.png')] bg-no-repeat bg-center bg-cover p-4 h-screen">
                <h1 className="text-4xl font-merriweather mb-2">{data.title}</h1>
                <div className="flex flex-col justify-center items-center">
                    <Image src="/Ornament.png" alt="An ornament" width={300} height={200} className="mb-2"/>
                    <h2 className="text-3xl font-parisienne text-[#004E89]">Ingredients</h2>
                    <div className="list-disc pl-5">
                        {data.extendedIngredients.map((ing: Ingredient, index: number) => (
                        <li key={`${ing.id}-${index}`} className="mb-1 font-merriweather">
                            {ing.original}
                        </li>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <Image src="/Ornament.png" alt="Nutella Stuffed French Toast" width={300} height={200} className="mb-2"/>
                    <h2 className="text-3xl font-parisienne text-[#004E89]">Instructions</h2>
                    <p className="text-base font-merriweather">{data.instructions}</p>
                </div>
            </section>   
        </main>
    )
}