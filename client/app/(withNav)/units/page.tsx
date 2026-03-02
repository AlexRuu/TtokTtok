import getUnits from "@/actions/get-units";
import { Unit } from "@/types";
import GroupedLessons from "./[unitsSlug]/lessons/components/grouped-lessons";
import getTags from "@/actions/get-tags";

const LessonsPage = async () => {
  const units = (await getUnits()) as Unit[];
  const tags = await getTags();

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#6B4C3B] mt-10 rounded-xl shadow-md pb-20">
      <div className="w-11/12 max-w-3xl mx-auto pt-14 pb-24 space-y-12">
        <h1 className="text-3xl font-semibold text-center tracking-wide">
          Lessons
        </h1>

        {/* Placeholder for search / filters */}
        <div className="mb-8">
          {/* Future search or filter component can go here */}
        </div>

        <GroupedLessons units={units} tags={tags} />

        {/* Placeholder for pagination / load more */}
        <div className="mt-8 flex justify-center">{/* <Pagination /> */}</div>
      </div>
    </div>
  );
};

export default LessonsPage;
