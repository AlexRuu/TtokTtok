import SummaryComponent from "./components/summary";
import TimelineComponent from "./components/timeline";
import BottomLogo from "./components/bottomLogo";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#6B4C3B] mt-10 rounded-xl shadow-md pb-20">
      <SummaryComponent />
      <TimelineComponent />
      <BottomLogo />
    </div>
  );
};

export default AboutPage;
