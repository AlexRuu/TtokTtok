import prismadb from "@/lib/prismadb";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";
import { Button } from "../ui/button";

const SummaryComponent = async () => {
  const users = await prismadb.user.findMany();
  const lessons = await prismadb.lesson.findMany();
  const units = await prismadb.unit.findMany();

  const newUsers = users.filter((user) => {
    const diff = formatDistanceToNowStrict(user.createdAt, { unit: "day" });
    const days = Number(diff.split(" ")[0]);
    return days < 7;
  }).length;

  const stats = [
    {
      label: "Total Users",
      value: users.length,
      href: "/users",
      colour: "indigo",
    },
    {
      label: "Total Units",
      value: units.length,
      href: "/units",
      colour: "sky",
    },
    {
      label: "Total Lessons",
      value: lessons.length,
      href: "/lessons",
      colour: "rose",
    },
    {
      label: "New Users (7d)",
      value: newUsers,
      colour: "lime",
    },
  ];

  const colourClasses: Record<string, string> = {
    indigo: "text-indigo-700 hover:bg-indigo-100 hover:text-indigo-900",
    sky: "text-sky-700 hover:bg-sky-100 hover:text-sky-900",
    rose: "text-rose-700 hover:bg-rose-100 hover:text-rose-900",
    lime: "text-lime-700 hover:bg-lime-100 hover:text-lime-900",
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Dashboard Summary</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {stats.map(({ label, value, href, colour }) => (
          <div
            key={label}
            className="flex flex-col justify-between border rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-sm">{label}</p>
              {href && (
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className={`text-xs px-2 py-1 ${colourClasses[colour]}`}
                >
                  <Link href={href}>View</Link>
                </Button>
              )}
            </div>
            <p className="text-2xl font-semibold mt-2">{value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default SummaryComponent;
