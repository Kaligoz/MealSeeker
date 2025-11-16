import type { Metadata } from "next";
import { Merriweather, Parisienne, Shadows_Into_Light_Two } from "next/font/google";
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
});

const parisienne = Parisienne({
  variable: "--font-parisienne",
  subsets: ["latin"],
  weight: "400",
});

const shadowsIntoLightTwo = Shadows_Into_Light_Two({
  variable: "--font-shadows-into-light-two",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "MealSeeker",
  description: "Get the meals you deserve and desire.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${merriweather.variable} ${parisienne.variable} ${shadowsIntoLightTwo.variable} antialiased`}
      >
        {children}
        <Toaster position="top-center" richColors/>
      </body>
    </html>
  );
}
