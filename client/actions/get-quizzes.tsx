const URL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/quiz`;

const getQuizzes = async () => {
  try {
    const res = await fetch(`${URL}`);
    if (!res.ok) throw new Error("Failed to fetch quizzes");
    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default getQuizzes;
