const URL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/units`;

const getUnits = async () => {
  try {
    const res = await fetch(`${URL}`);
    if (!res.ok) {
      console.error("Error fetching units");
      return null;
    }
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};
export default getUnits;
