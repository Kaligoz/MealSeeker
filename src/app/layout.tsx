import type { Metadata } from "next";
import { Merriweather, Parisienne } from "next/font/google";
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
        className={`${merriweather.variable} ${parisienne.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
