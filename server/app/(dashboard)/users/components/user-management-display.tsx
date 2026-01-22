"use client";

import { User } from "@/lib/generated/prisma/client";
import { subDays } from "date-fns";
import { UserTable } from "./user-table";
import { ColumnDef } from "@tanstack/react-table";
import { AlertModal } from "@/components/ui/alert-modal";
import { useEffect, useState } from "react";
import useLoading from "@/hooks/use-loading";
import { deleteRequestedUsers } from "@/actions/delete-actions";
import { useRouter } from "next/navigation";

interface UserManagementDisplayProps {
  users: User[];
  columns: ColumnDef<User>[];
}

const UserManagementDisplay: React.FC<UserManagementDisplayProps> = ({
  users,
  columns,
}) => {
  const { stopLoading, startLoading } = useLoading();
  const [isOpen, setIsOpen] = useState(false);
  const deleteThresholdDate = subDays(new Date(), 30);
  const router = useRouter();

  const deleteRequested = users.filter((user) => user.status === "INACTIVE");
  const activeUsers = users.filter((user) => user.status === "ACTIVE");
  const needDelete = deleteRequested.filter(
    (user) => user.updatedAt < deleteThresholdDate,
  );

  useEffect(() => {
    if (needDelete.length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [needDelete.length]);

  const handleDelete = async () => {
    startLoading();
    await deleteRequestedUsers();
    stopLoading();
    setIsOpen(false);
    router.refresh();
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Users Requested Deletion: 30 Day Warning"
        description={`There are ${needDelete.length} user(s) that need to be deleted. Would you like to delete them now?`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={() => handleDelete()}
        variant="destructive"
      />
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

export default UserManagementDisplay;
