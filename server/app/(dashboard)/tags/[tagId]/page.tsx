import { findUniqueTag } from "@/prisma/prismaFetches";
import TagForm from "../components/tag-form";
import { notFound } from "next/navigation";

const EditTagPage = async (props: { params: Promise<{ tagId: string }> }) => {
  const params = await props.params;
  const tag = await findUniqueTag(params.tagId);

  if (!tag) {
    notFound();
  }

  return (
    <div>
      <TagForm initialData={tag} />
    </div>
  );
};

export default EditTagPage;
