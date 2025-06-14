import QuickActions from "@/components/dashboard/quick-actions";
import SummaryComponent from "@/components/dashboard/summary";

const AdminPage = async () => {
  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#6B4C3B] rounded-xl shadow-md pb-20">
      <h1 className="text-2xl font-bold p-10">Overview</h1>
      <div className="grid grid-cols-[83%_17%] px-10">
        <SummaryComponent />
        <QuickActions />
      </div>
    </div>
  );
};

export default AdminPage;
