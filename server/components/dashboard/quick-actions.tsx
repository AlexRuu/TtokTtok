import {
  ClipboardCheck,
  Languages,
  Layers,
  Notebook,
  Tags,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import CreateButton from "../ui/create-button";

const links = [
  {
    icon: <Layers />,
    title: "Create Unit",
    path: "units",
    className:
      "bg-sky-100 text-sky-700 ring-sky-300 hover:bg-sky-200 hover:text-sky-800",
  },
  {
    icon: <Notebook />,
    title: "Create Lesson",
    path: "lessons",
    className:
      "bg-blue-100 text-blue-800 ring-blue-300 hover:bg-blue-200 hover:text-blue-900",
  },
  {
    icon: <Tags />,
    title: "Create Tag",
    path: "tags",
    className:
      "bg-violet-100 text-violet-800 ring-violet-300 hover:bg-violet-200 hover:text-violet-900",
  },
  {
    icon: <Languages />,
    title: "Create Vocabulary",
    path: "vocabulary",
    className:
      "bg-rose-100 text-rose-800 ring-rose-300 hover:bg-rose-200 hover:text-rose-900",
  },
  {
    icon: <ClipboardCheck />,
    title: "Create Quiz",
    path: "quizzes",
    className:
      "bg-lime-100 text-lime-800 ring-lime-300 hover:bg-lime-200 hover:text-lime-900",
  },
];

const QuickActions = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Create new lesson content</CardDescription>
      </CardHeader>
      <CardContent>
        {links.map((link, index) => (
          <div className="mb-3" key={index}>
            <CreateButton
              title={link.title}
              className={link.className}
              icon={link.icon}
              path={link.path}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default QuickActions;
