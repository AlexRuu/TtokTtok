const URL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/quiz/slug`;

const postQuizResult = async (
  slug: string,
  answers: Record<string, string | boolean | Record<string, string>>,
  questionIds: string[]
) => {
  try {
    const res = await fetch(`${URL}/${slug}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, questionIds }),
    });

    const data = await res.json().catch(() => ({}));

    if (res.status === 429 || data.rateLimited) {
      return {
        results: null,
        error: "rateLimited",
        remaining: data.remaining ?? 0,
      };
    }

    if (!res.ok) {
      return {
        results: null,
        error: `Failed to submit: ${res.status}`,
        remaining: 0,
      };
    }

    return { results: data, error: null, remaining: 0 };
  } catch (error) {
    console.error("postQuizResult error:", error);
    return { results: null, error: "Error submitting quiz", remaining: 0 };
  }
};

export default postQuizResult;
