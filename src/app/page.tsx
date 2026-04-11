import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import FeaturedVehicles from "@/components/sections/FeaturedVehicles";
import Brands from "@/components/sections/Brands";
import AboutUs from "@/components/sections/AboutUs";
import Services from "@/components/sections/Services";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <FeaturedVehicles />
        <Brands />
        <AboutUs />
        <Services />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
