import prismadb from "@/lib/prismadb";
import React from "react";
import EditUserForm from "./components/edit-form";

type UserPageProps = {
  params: {
    userId: string;
  };
};

const EditUserPage = async ({ params }: UserPageProps) => {
  const { userId } = await params;
  const user = await prismadb.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <div>
      <EditUserForm initialData={user} />
    </div>
  );
};

export default EditUserPage;
