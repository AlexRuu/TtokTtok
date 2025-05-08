import { ReactNode } from "react";

const ProfileContainer = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) => {
  return (
    <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#6B4C3B]">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-[#A07C6D]">{description}</p>
        )}
      </div>
      <div className="bg-[#FFF7F2] border border-[#ECDCD3] rounded-xl shadow-sm p-6 space-y-4">
        {children}
      </div>
    </section>
  );
};

export default ProfileContainer;
