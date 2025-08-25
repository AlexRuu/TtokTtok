const URL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/quiz/slug`;

const getQuiz = async (slug: string) => {
  try {
    const res = await fetch(`${URL}/${slug}`);
    if (!res.ok) throw new Error("Failed to fetch quizz");
    return res.json();
  } catch (error) {
    console.error(error);
    return;
  }
};

export default getQuiz;
