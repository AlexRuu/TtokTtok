import getUnits from "@/actions/get-units";
import { Unit } from "@/types";
import GroupedLessons from "./components/grouped-lessons";

const LessonsPage = async () => {
  const units = (await getUnits()) as Unit[];

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#6B4C3B] mt-10 rounded-xl shadow-md pb-20">
      <div className="w-11/12 max-w-4xl mx-auto pt-5">
        <h1 className="text-3xl font-semibold mb-8 text-center tracking-wide">
          Lessons
        </h1>

        <GroupedLessons units={units} />
      </div>
    </div>
  );
};

export default LessonsPage;
