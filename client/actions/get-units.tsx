const URL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/units`;

const getUnits = async () => {
  try {
    const res = await fetch(`${URL}`);
    if (!res.ok) {
      console.log("Error fetching units");
      return null;
    }

    const units = res.json();
    return units;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export default getUnits;
