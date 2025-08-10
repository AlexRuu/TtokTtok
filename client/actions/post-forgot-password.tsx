const URL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/auth/forgot-password`;

const postForgotPassword = async (email: string) => {
  try {
    const res = await fetch(`${URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    return res;
  } catch (error) {
    console.log("Could not send password reset email", error);
    return;
  }
};

export default postForgotPassword;
