const URL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/quiz/slug`;

const getQuiz = async (slug: string) => {
  try {
    const res = await fetch(`${URL}/${slug}`, {
      method: "GET",
      credentials: "include",
    });

    const data = await res.json().catch(() => ({}));

    if (res.status === 429 && !data.quiz) {
      return {
        quiz: null,
        rateLimited: true,
        remaining: data.remaining ?? 0,
      };
    }

    if (data.quiz) {
      return {
        quiz: data.quiz,
        rateLimited: !!data.rateLimited,
        remaining: data.remaining ?? 0,
      };
    }

    return {
      quiz: data.quiz ?? data,
      rateLimited: false,
      remaining: 0,
    };
  } catch (error) {
    console.error("getQuiz error:", error);
    return { quiz: null, rateLimited: false, remaining: 0 };
  }
};

export default getQuiz;
