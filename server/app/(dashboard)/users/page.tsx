import { findUsers } from "@/prisma/prismaFetches";
import { UserTable } from "./components/user-table";
import { columns } from "./components/columns";

const AdminUsersPage = async () => {
  const users = await findUsers();
  const deleteRequested = users.filter((user) => user.status === "INACTIVE");
  const activeUsers = users.filter((user) => user.status === "ACTIVE");

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h1 className="text-2xl font-semibold">User Management</h1>
      {deleteRequested.length > 0 && (
        <UserTable
          data={deleteRequested}
          columns={columns}
          title="Deletion Requested"
        />
      )}
      <UserTable data={activeUsers} columns={columns} title="Active Users" />
    </div>
  );
};

export default AdminUsersPage;
