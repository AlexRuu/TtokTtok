const URL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/tags`;

const getTags = async () => {
  try {
    const res = await fetch(`${URL}`);
    if (!res.ok) {
      console.log("Error fetching tags.");
      return null;
    }
    const tags = res.json();
    return tags;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export default getTags;
