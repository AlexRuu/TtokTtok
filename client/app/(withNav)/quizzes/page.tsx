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
      {/* Sidebar */}
      <QuizNavigationDesktop units={units} />

      {/* Mobile Navigation */}
      <QuizNavigationMobile units={units} />

      {/* Main content */}
      <main className="flex-1 bg-[#FFF9F5] text-[#6B4C3B] rounded-2xl shadow-md p-8 space-y-12">
        <h1 className="text-3xl font-bold text-[#6B4C3B] mb-6">Quizzes</h1>

        <QuizDisplay quizzes={quizzes} />
      </main>
    </div>
  );
};

export default QuizPage;
