import { cache } from "react";

const URL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/vocabulary/slug`;

const getVocabulary = cache(async (slug: string) => {
  try {
    const res = await fetch(`${URL}/${slug}`, { next: { revalidate: 300 } });
    if (!res.ok) {
      console.log("Error fetching vocabulary");
      return null;
    }
    const vocabulary = await res.json();
    return vocabulary;
  } catch (error) {
    console.error("Failed to fetch vocabulary", error);
    return null;
  }
});

export default getVocabulary;
