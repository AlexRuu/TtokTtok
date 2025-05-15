const URL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/auth/reset-password`;

interface Data {
  password: string;
  confirmPassword: string;
}

const postResetToken = async (data: Data, token: string) => {
  try {
    const res = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, token }),
    });
    return res;
  } catch (error) {
    console.log("Error resetting password", error);
    return;
  }
};

export default postResetToken;
