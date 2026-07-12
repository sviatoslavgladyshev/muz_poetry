import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Teachers } from "@/components/sections/teachers";
import { Directions } from "@/components/sections/directions";
import { CulturalClub } from "@/components/sections/cultural-club";
import { Pricing } from "@/components/sections/pricing";
import { Afisha } from "@/components/sections/afisha";
import { Contacts } from "@/components/sections/contacts";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Teachers />
      <Directions />
      <CulturalClub />
      <Pricing />
      <Afisha />
      <Contacts />
    </>
  );
}
