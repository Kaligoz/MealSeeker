import { Suspense } from "react";
import { MealSeekerContent } from "./MealSeeker";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MealSeekerContent />
    </Suspense>
  );
}