import { findUniqueTag } from "@/prisma/prismaFetches";
import TagForm from "../components/tag-form";

const EditTagPage = async ({ params }: { params: { tagId: string } }) => {
  const tag = await findUniqueTag(params.tagId);

  if (!tag) {
    return <div>Tag not found.</div>;
  }

  return (
    <div>
      <TagForm initialData={tag} />
    </div>
  );
};

export default EditTagPage;
