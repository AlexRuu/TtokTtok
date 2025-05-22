import prismadb from "@/lib/prismadb";
import React from "react";
import EditUnitsForm from "./components/edit-units-form";

type EditUnitsFormProp = {
  params: {
    unitId: string;
  };
};

const EditUnitsFormPage = async ({ params }: EditUnitsFormProp) => {
  const { unitId } = await params;
  const unit = await prismadb.unit.findUnique({
    where: {
      id: unitId,
    },
  });

  if (!unit) {
    return <div>User not found.</div>;
  }

  return (
    <div>
      <EditUnitsForm initialData={unit} />
    </div>
  );
};

export default EditUnitsFormPage;
