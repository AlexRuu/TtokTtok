import { findUsers } from "@/prisma/prismaFetches";
import { columns } from "./components/columns";
import UserManagementDisplay from "./components/user-management-display";

const AdminUsersPage = async () => {
  const users = await findUsers();

  return <UserManagementDisplay users={users} columns={columns} />;
};

export default AdminUsersPage;
