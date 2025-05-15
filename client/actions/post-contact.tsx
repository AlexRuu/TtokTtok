const URL = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/contact`;

interface Data {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string;
}

const postContact = async (data: Data) => {
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
    console.log("Error sending contact form", error);
    return;
  }
};

export default postContact;
