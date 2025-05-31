import { notFound } from "next/navigation";
import UnitsForm from "../components/units-form";
import { findUniqueUnit } from "@/prisma/prismaFetches";

const EditUnitsFormPage = async (props: {
  params: Promise<{ unitId: string }>;
}) => {
  const params = await props.params;
  const unit = await findUniqueUnit(params.unitId);

  if (!unit) {
    notFound();
  }

  return (
    <div>
      <UnitsForm initialData={unit} />
    </div>
  );
};

export default EditUnitsFormPage;
