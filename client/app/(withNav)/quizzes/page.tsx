import { Metadata } from "next";
import QuizDisplay from "./components/display";
import getQuizzes from "@/actions/get-quizzes";
import getUnits from "@/actions/get-units";
import QuizNavigationDesktop from "./components/navigation-desktop";
import QuizNavigationMobile from "./components/navigation-mobile";

export const metadata: Metadata = {
  title: "Quizzes",
  description: "TtokTtok Quizzes",
};

const QuizPage = async () => {
  const quizzes = await getQuizzes();
  const units = await getUnits();

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Desktop navigation sidebar */}
      <QuizNavigationDesktop units={units} />

      {/* Mobile Navigation */}
      <QuizNavigationMobile units={units} />

      {/* Main content */}
      <main className="flex-1 bg-[#FFF9F5] text-[#6B4C3B] rounded-3xl border border-[#F3E4DA] p-8 space-y-8">
        <h1 className="text-4xl font-bold tracking-tight text-[#5A3F2C]">
          Quizzes
        </h1>
        <p className="text-sm text-[#9C7B6A] -mt-6 border-b pb-2 border-[#e8d7cc]">
          Browse quizzes by unit and lesson.
        </p>
        <QuizDisplay quizzes={quizzes} />
      </main>
    </div>
  );
};

export default QuizPage;
