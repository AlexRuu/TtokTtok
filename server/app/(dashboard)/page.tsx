import SummaryComponent from "@/components/dashboard/summary";

const AdminPage = async () => {
  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#6B4C3B] rounded-xl shadow-md pb-20">
      <h1 className="text-2xl font-bold p-10">Overview</h1>
      <div className="p-10 mx-10 border rounded-2xl shadow-md">
        <SummaryComponent />
      </div>
    </div>
  );
};

export default AdminPage;
