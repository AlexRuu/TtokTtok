import { notFound } from "next/navigation";
import EditUserForm from "./components/edit-form";
import { findUniqueUser } from "@/prisma/prismaFetches";

const EditUserPage = async (props: { params: Promise<{ userId: string }> }) => {
  const params = await props.params;
  const user = await findUniqueUser(params.userId);

  if (!user) {
    notFound();
  }

  return (
    <div>
      <EditUserForm initialData={user} />
    </div>
  );
};

export default EditUserPage;
