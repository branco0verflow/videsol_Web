import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import FeaturedVehicles from "@/components/sections/FeaturedVehicles";
import Brands from "@/components/sections/Brands";
import AboutUs from "@/components/sections/AboutUs";
import Contact from "@/components/sections/Contact";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";

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
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
