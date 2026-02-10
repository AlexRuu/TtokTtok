const URL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/vocabulary`;

const getVocabularyList = async () => {
  try {
    const res = await fetch(`${URL}`, { next: { revalidate: 300 } });
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
};

export default getVocabularyList;
