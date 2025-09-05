import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const ingredients = searchParams.get('ingredients')
    
    if(!ingredients) {
        return NextResponse.json({error: "No ingredients provided"}, {status: 400 })
    }

    const apiKey = process.env.SPOONACULAR_API_KEY

    const res = await fetch(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&apiKey=${apiKey}`
    )

    const data = await res.json()
    return NextResponse.json(data)
};