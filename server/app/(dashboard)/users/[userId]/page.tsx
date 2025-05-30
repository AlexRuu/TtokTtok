import EditUserForm from "./components/edit-form";
import { findUniqueUser } from "@/prisma/prismaFetches";

const EditUserPage = async ({ params }: { params: { userId: string } }) => {
  const user = await findUniqueUser(params.userId);

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
