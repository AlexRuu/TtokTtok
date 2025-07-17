import { SearchResult } from "@/types";

const getSearchResults = async (
  query: string
): Promise<SearchResult[] | null> => {
  const URL = `${
    process.env.NEXT_PUBLIC_NEXTAUTH_URL
  }/api/search?q=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(URL);

    if (!res.ok) {
      console.error("Failed to fetch search results");
      return null;
    }

    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching search results:", error);
    return null;
  }
};

export default getSearchResults;
