import { GroupedSearchResults } from "@/types";

const getSearchTagsResults = async (
  query: string
): Promise<GroupedSearchResults | null> => {
  const URL = `${
    process.env.NEXT_PUBLIC_NEXTAUTH_URL
  }/api/search-tags?tags=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(URL);

    if (!res.ok) {
      console.error("Failed to fetch search tags results");
      return null;
    }

    const data: GroupedSearchResults = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching search tags results:", error);
    return null;
  }
};

export default getSearchTagsResults;
