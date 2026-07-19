import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Instagram } from "@/components/instagram";
import { Marquee } from "@/components/marquee";
import { Products } from "@/components/products";
import { Story } from "@/components/story";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Products />
        <Story />
        <Instagram />
      </main>
      <Footer />
    </>
  );
}
