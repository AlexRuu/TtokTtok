const URL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/quiz/slug`;

const getQuiz = async (slug: string, inProgress: boolean) => {
  try {
    const res = await fetch(`${URL}/${slug}`, {
      headers: { "x-in-progress": inProgress ? "true" : "false" },
    });
    if (res.status === 429) {
      return { quiz: null, rateLimited: true };
    }
    if (!res.ok) return { quiz: null, rateLimited: false };

    const data = await res.json();
    return { quiz: data, rateLimited: false };
  } catch (error) {
    console.error(error);
    return { quiz: null, rateLimited: false };
  }
};

export default getQuiz;
