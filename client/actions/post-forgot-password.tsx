const URL = `${process.env.NEXTAUTH_URL}/api/profile`;

const postForgotPassword = async (data: string) => {
  try {
    const res = await fetch(`${URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return res;
  } catch (error) {
    console.log("Could not send password reset email", error);
    return;
  }
};

export default postForgotPassword;
