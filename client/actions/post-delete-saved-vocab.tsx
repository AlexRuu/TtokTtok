const URL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/vocabulary/save`;

export const postSavedVocab = async (vocabularyId: string) => {
  try {
    const res = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ vocabulary: { id: vocabularyId } }),
    });

    return res;
  } catch (error) {
    console.log("Could not save vocabulary", error);
  }
};

export const deleteSavedVocab = async (vocabularyId: string) => {
  try {
    const res = await fetch(URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ vocabulary: { id: vocabularyId } }),
    });

    return res;
  } catch (error) {
    console.log("Could not delete saved vocabulary", error);
  }
};
