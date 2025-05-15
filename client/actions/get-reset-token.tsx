const URL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/auth/reset-password?token=`;

const getResetToken = async (token: string) => {
  try {
    const res = await fetch(`${URL}/${token})`);
    return res;
  } catch (error) {
    console.log("Error verifying token", error);
    return;
  }
};

export default getResetToken;
