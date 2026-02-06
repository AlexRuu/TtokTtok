const URL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/vocabulary/save`;

export const getSavedVocab = async (): Promise<{
  savedIds: string[];
} | null> => {
  try {
    const res = await fetch(URL, {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch saved vocabularies");
    }

    const data = await res.json();

    const savedIds = data.savedVocab.map(
      (v: { vocabularyId: string }) => v.vocabularyId,
    );
    return { savedIds };
  } catch (error) {
    console.error("Could not fetch saved vocabularies", error);
    return null;
  }
};
