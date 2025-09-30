const URL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/quiz/slug`;

const getQuizMetadata = async (slug: string) => {
  try {
    const res = await fetch(`${URL}/${slug}/metadata`);
    if (!res.ok) {
      return { metadata: null, error: `Failed to fetch: ${res.status}` };
    }
    const data = await res.json();
    return { metadata: data, error: null };
  } catch (error) {
    console.error(error);
    return { metadata: null, error: "Error fetching metadata" };
  }
};

export default getQuizMetadata;
