const URL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/auth/verify`;

const postVeriifyEmail = async (token: string) => {
  try {
    const res = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    return res;
  } catch (error) {
    console.log("Error verifying email", error);
    return;
  }
};

export default postVeriifyEmail;
