import { authOptions } from "@/lib/auth";
import { withRls } from "@/lib/withRLS";
import { getServerSession } from "next-auth";

import { NextResponse } from "next/server";

export async function GET(_req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    return await withRls(session, async (tx) => {
      const profile = await tx.user.findFirst({
        where: { email: session.user.email },
        include: { userStats: true },
      });

      if (!profile) {
        return new NextResponse("Profile not found", { status: 400 });
      }

      const userProfile = {
        email: profile.email,
        firstName: profile.firstName,
        lastName: profile.lastName,
        stats: profile.userStats,
      };

      return NextResponse.json(userProfile);
    });
  } catch (error) {
    console.error("Error retrieving profile", error);
    return new NextResponse("Could not retrieve profile", { status: 500 });
  }
}
