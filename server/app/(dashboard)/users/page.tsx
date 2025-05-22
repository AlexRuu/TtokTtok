import prismadb from "@/lib/prismadb";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Table, TableHead, TableHeader } from "@/components/ui/table";

const AdminUsersPage = async () => {
  const users = await prismadb.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-4 sm:p-6 space-y-6">
      <h1 className="text-2xl font-semibold">User Management</h1>

      {/* Table view for md+ */}
      <div className="hidden md:block overflow-auto border rounded-lg">
        <Table>
          <TableHeader>
            <TableHead className="px-4 py-2">Name</TableHead>
            <TableHead className="px-4 py-2">Email</TableHead>
            <TableHead className="px-4 py-2">Role</TableHead>
            <TableHead className="px-4 py-2">Status</TableHead>
            <TableHead className="px-4 py-2">Actions</TableHead>
          </TableHeader>
        </Table>
        <table className="min-w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-background divide-y">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-2">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2 capitalize">
                  <Badge variant="outline">{user.role || "user"}</Badge>
                </td>
                <td className="px-4 py-2">
                  {user.status === "ACTIVE" ? (
                    <Badge variant="success">Active</Badge>
                  ) : (
                    <Badge variant="destructive">Inactive</Badge>
                  )}
                </td>
                <td className="px-4 py-2 space-x-2">
                  <Button size="sm" variant="outline">
                    <Link href={`/users/${user.id}`}>Edit</Link>
                  </Button>
                  <Button size="sm" variant="destructive">
                    Deactivate
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="md:hidden space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="border rounded-lg p-4 shadow-xs bg-white dark:bg-background"
          >
            <div className="text-lg font-medium mb-1">
              {user.firstName} {user.lastName}
            </div>
            <div className="text-sm text-muted-foreground mb-2">
              {user.email}
            </div>
            <div className="flex items-center gap-2 text-sm mb-2">
              <Badge variant="outline">{user.role || "user"}</Badge>
              {user.status === "ACTIVE" ? (
                <Badge variant="success">Active</Badge>
              ) : (
                <Badge variant="destructive">Inactive</Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="w-full">
                <Link href={`/users/${user.id}`}>Edit</Link>
              </Button>
              <Button size="sm" variant="destructive" className="w-full">
                Deactivate
              </Button>
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <div className="text-center text-muted-foreground text-sm">
            No users found.
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsersPage;
