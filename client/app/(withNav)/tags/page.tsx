import getTags from "@/actions/get-tags";
import { Metadata } from "next";
import TagFilterClient from "./components/tag-filter";

export const metadata: Metadata = {
  title: "Tags",
  description: "Filter TtokTtok content by tags",
};

const TagsPage = async () => {
  const tags = await getTags();

  return (
    <div
      className="
    mx-auto mt-8 max-w-4xl w-full
    px-4 sm:px-6 py-12
    bg-[#FFF9F5] text-[#6B4C3B]
    rounded-2xl shadow-md
    space-y-10 mb-8
    border border-[#F3E5D5]
  "
    >
      <h1 className="text-xl font-semibold mb-6 text-[#6B4C3B]">
        Explore by Tags
      </h1>
      <TagFilterClient allTags={tags} />
    </div>
  );
};

export default TagsPage;
