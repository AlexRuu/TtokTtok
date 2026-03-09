const URL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/tags`;

const getTags = async () => {
  try {
    const res = await fetch(`${URL}`);
    if (!res.ok) {
      console.error("Error fetching tags.");
      return null;
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching tags", error);
    return null;
  }
};

export default getTags;
