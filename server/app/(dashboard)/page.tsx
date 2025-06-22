import ContentData from "@/components/dashboard/content-data";
import ContentWarning from "@/components/dashboard/content-warning";
import QuickActions from "@/components/dashboard/quick-actions";
import SummaryComponent from "@/components/dashboard/summary";
import Todo from "@/components/dashboard/todo";

const AdminPage = async () => {
  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#6B4C3B] rounded-xl pb-20">
      <h1 className="text-3xl font-bold px-6 py-10">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-6 px-6">
        <div className="space-y-4 md:block hidden">
          <QuickActions />
          <Todo />
        </div>
        <div className="space-y-4">
          <SummaryComponent />
          <ContentWarning />
          <ContentData />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
