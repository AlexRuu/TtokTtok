import { headers } from "next/headers";
import { redirect } from "next/navigation";

const URL = `${process.env.NEXTAUTH_URL}/api/profile`;

const getProfile = async () => {
  try {
    const res = await fetch(`${URL}`, {
      method: "GET",
      headers: await headers(),
      mode: "cors",
      credentials: "include",
    });

    const profile = await res.json();
    return profile;
  } catch (error) {
    console.log("Could not fetch profile", error);
    redirect("/signin");
  }
};

export default getProfile;
