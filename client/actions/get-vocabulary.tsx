const URL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/vocabulary/slug`;

const getVocabulary = async (slug: string) => {
  try {
    const res = await fetch(`${URL}/${slug}`, { cache: "no-store" });
    if (!res.ok) {
      console.log("Error fetching vocabulary");
      return null;
    }
    const vocabulary = await res.json();
    return vocabulary;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export default getVocabulary;
