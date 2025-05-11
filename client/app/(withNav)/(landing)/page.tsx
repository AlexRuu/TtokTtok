import HowItWorks from "./components/how";
import HeroComponent from "./components/hero";
import CallToActionComponent from "./components/callToAction";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#6B4C3B] mt-10 rounded-xl shadow-md">
      <HeroComponent fadeInUp={fadeInUp} />
      <HowItWorks />
      <CallToActionComponent fadeInUp={fadeInUp} />
    </div>
  );
}
