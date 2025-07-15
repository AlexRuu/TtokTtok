const URL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/lessons/slug`;

const getLesson = async (slug: string) => {
  try {
    const res = await fetch(`${URL}/${slug}`);
    const lesson = res.json();
    return lesson;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export default getLesson;
