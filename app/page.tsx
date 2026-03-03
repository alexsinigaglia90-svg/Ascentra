import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import HeroVideo from "@/components/HeroVideo";
import Intro from "@/components/Intro";
import PlatformTeaser from "@/components/PlatformTeaser";
import ProofBand from "@/components/ProofBand";
import TriadPillars from "@/components/TriadPillars";

export default function Home() {
  return (
    <>
      <HeroVideo />
      <main>
        <Intro />
        <TriadPillars />
        <PlatformTeaser />
        <ProofBand />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
