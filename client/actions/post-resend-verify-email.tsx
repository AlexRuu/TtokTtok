const URL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/auth/resend`;

const postResendEmail = async (email: string) => {
  try {
    const res = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    return res;
  } catch (error) {
    console.error("Error resending confirmation email", error);
    return;
  }
};

export default postResendEmail;
