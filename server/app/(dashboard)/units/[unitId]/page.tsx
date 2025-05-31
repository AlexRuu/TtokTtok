import UnitsForm from "../components/units-form";
import { findUniqueUnit } from "@/prisma/prismaFetches";

const EditUnitsFormPage = async ({
  params,
}: {
  params: { unitId: string };
}) => {
  const unit = await findUniqueUnit(params.unitId);

  if (!unit) {
    return <div>Unit not found.</div>;
  }

  return (
    <div>
      <UnitsForm initialData={unit} />
    </div>
  );
};

export default EditUnitsFormPage;
