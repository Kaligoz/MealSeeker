"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { detectIngredients, verifyIngredients } from "./actions";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface FridgeScannerProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onConfirm: (ingredients: string[]) => void;
};

type DetectedIngredient = {
  name: string
  confidence: number
};

export default function FridgeScanner({ isOpen, setIsOpen, onConfirm }: FridgeScannerProps) {

  const [images, setImages] = useState<{ base64: string; type: string }[]>([])
  const [detected, setDetected] = useState<DetectedIngredient[]>([])
  const [avgConfidence, setAvgConfidence] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    if (files.length > 4) {
      toast.error("Maximum 4 photos allowed")
      return
    }

    setLoading(true)

    try {
      const newImages: { base64: string; type: string }[] = []

      for (const file of Array.from(files)) {
        const reader = new FileReader()

        const base64 = await new Promise<string>((resolve) => {
          reader.onloadend = () => {
            resolve((reader.result as string).split(",")[1])
          }
          reader.readAsDataURL(file)
        })

        newImages.push({
          base64,
          type: file.type,
        })
      }

      setImages(newImages)

      const data = await detectIngredients(newImages)

      setDetected(data.ingredients)
      const avg =
      data.ingredients.reduce(
        (sum: number, i: DetectedIngredient) => sum + i.confidence,
        0
      ) / Math.max(data.ingredients.length, 1)

      setAvgConfidence(avg)
    } catch {
      toast.error("Initial scan failed.")
    } finally {
      setLoading(false)
    }
  }

  const handleDoubleCheck = async () => {
    if (images.length === 0) return
    setIsVerifying(true)
    toast.info("Auditing detection...")
    try {
      const data = await verifyIngredients(images, detected.map(i => i.name))
      setDetected(data.ingredients)
      const avg =
      data.ingredients.reduce(
        (sum: number, i: DetectedIngredient) => sum + i.confidence,
        0
      ) / Math.max(data.ingredients.length, 1)

      setAvgConfidence(avg)
      toast.success("List refined!")
    } catch {
      toast.error("Verification failed.")
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-[#EFEFD0] rounded-xl p-6">
        <DialogHeader>
          <DialogTitle>Fridge Scanner</DialogTitle>
          <DialogDescription>
            To use this function please upload a photo your opened fridge for us scan and give you a list of ingredients
            Maximum amount of photos are 4.
          </DialogDescription>
        </DialogHeader>

        <p className="text-sm text-gray-600">
          {images.length} photo{images.length > 1 ? "s" : ""} uploaded
        </p>

        {avgConfidence !== null && (
          <p className="text-sm text-gray-700">
            Avg confidence: {(avgConfidence * 100).toFixed(0)}%
          </p>
        )}

        {images.length === 0 ? (
          <input type="file" accept="image/*" capture="environment" multiple onChange={handleUpload} className="mb-4 hover:cursor-pointer w-full " />
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border rounded">
              {detected.map((ing, i) => (
                <span key={i} className="bg-blue-100 px-2 py-1 rounded-md text-sm flex items-center">
                  {ing.name}
                  <button
                    onClick={() =>
                      setDetected(d => d.filter((_, idx) => idx !== i))
                    }
                    className="ml-2 text-xs"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <Button onClick={handleDoubleCheck} variant="outline" disabled={isVerifying} className="flex-1 hover:cursor-pointer font-light text-xl bg-[#008489] text-[#EFEFD0] hover:bg-[#1a749e] hover:text-[#EFEFD0]">
                {isVerifying ? "Verifying..." : "Double Check"}
              </Button>
              <Button onClick={() => onConfirm(detected.map(item => item.name))} className="flex-1 hover:cursor-pointer font-light text-xl bg-[#004E89] text-[#EFEFD0] hover:bg-[#1A659E] hover:text-[#EFEFD0]">
                Add to List
              </Button>
            </div>
          </div>
        )}
        <Button onClick={() => {setIsOpen(false)}} variant="ghost" className="w-full mt-2 hover:cursor-pointer font-light text-xl bg-[#004E89] text-[#EFEFD0] hover:bg-[#1A659E] hover:text-[#EFEFD0]">Cancel</Button>
      </DialogContent>
    </Dialog>
  )
};