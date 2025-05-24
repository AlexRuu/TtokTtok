const URL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/units`;

const getUnits = async () => {
  try {
    const res = await fetch(`${URL}`);
    const units = res.json();
    return units;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export default getUnits;
