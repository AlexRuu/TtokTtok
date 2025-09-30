const URL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/quiz/slug`;

const postQuizResult = async (
  slug: string,
  answers: Record<string, string | boolean | Record<string, string>>,
  questionIds: string[]
) => {
  try {
    const res = await fetch(`${URL}/${slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, questionIds }),
    });

    if (!res.ok) {
      return { results: null, error: `Failed to submit: ${res.status}` };
    }

    const data = await res.json();
    return { results: data, error: null };
  } catch (error) {
    console.error(error);
    return { results: null, error: "Error submitting quiz" };
  }
};

export default postQuizResult;
