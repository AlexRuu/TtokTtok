const URL = `${process.env.NEXTAUTH_URL}/api/auth/signup`;

interface Data {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const postSignUp = async (data: Data) => {
  try {
    const res = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return res;
  } catch (error) {
    console.log("Error signing up", error);
    return;
  }
};

export default postSignUp;
