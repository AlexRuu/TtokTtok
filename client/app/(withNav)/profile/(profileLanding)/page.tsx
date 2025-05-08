import getProfile from "@/actions/get-profile";
import ProfileContainer from "../components/profileContainer";

const ProfilePage = async () => {
  const profile = await getProfile();
  if (!profile) {
    return;
  }

  return (
    <ProfileContainer
      title="Overview"
      description="Review your account summary."
    >
      <div className="space-y-6">
        <div>
          <h2 className="font-semibold text-[#6B4C3B] text-lg mb-3">
            Personal Information
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-[#6B4C3B]">
                First Name
              </h3>
              <p className="text-[#A07C6D] mt-1">{profile.firstName}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#6B4C3B]">
                Last Name
              </h3>
              <p className="text-[#A07C6D] mt-1">{profile.lastName}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#6B4C3B]">Email </h3>
              <p className="text-[#A07C6D] mt-1">{profile.email}</p>
            </div>
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-[#6B4C3B] text-lg mb-3">Stats</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-[#6B4C3B]">
                Units Completed
              </h3>
              <p className="text-[#A07C6D] mt-1">temp: 3</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#6B4C3B]">
                Last Unit Completed
              </h3>
              <p className="text-[#A07C6D] mt-1">temp: 3</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#6B4C3B]">
                Vocabulary Learned
              </h3>
              <p className="text-[#A07C6D] mt-1">temp: 3</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#6B4C3B]">
                Quizzes Completed
              </h3>
              <p className="text-[#A07C6D] mt-1">temp: 3</p>
            </div>
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-[#6B4C3B] text-lg mb-3">
            Next Steps
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-[#6B4C3B]">
                Next Lesson
              </h3>
              <p className="text-[#A07C6D] mt-1">temp: 3</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#6B4C3B]">
                Next Quiz
              </h3>
              <p className="text-[#A07C6D] mt-1">temp: 3</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#6B4C3B]">
                Review a Unit
              </h3>
              <p className="text-[#A07C6D] mt-1">temp: 3</p>
            </div>
          </div>
        </div>
      </div>
    </ProfileContainer>
  );
};

export default ProfilePage;
