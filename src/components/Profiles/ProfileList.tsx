import { ProfileItem } from "./ProfileItem";
import { useProfilesPaginated } from "./useProfilePaginated";

const PAGE_SIZE = 8;

const ProfileList = () => {
  const { profilePages, isFetchingNextPage, ref } = useProfilesPaginated({
    pageSize: PAGE_SIZE,
  });

  return (
    <>
      <ul className="flex flex-col overflow-hidden rounded-md border border-gray-600">
        {profilePages?.pages?.map((page, pageIndex) =>
          page.profiles.map((profile, profileIndex) => (
            <li
              className="border-b border-b-gray-600 bg-base-300 p-4 last:border-b-0"
              key={profile.github}
            >
              <ProfileItem
                profile={profile}
                position={PAGE_SIZE * pageIndex + profileIndex + 1}
              />
            </li>
          ))
        )}
      </ul>
      <div className="mt-4 text-center text-xs" ref={ref}>
        <h2>{isFetchingNextPage && `Bringing more...`}</h2>
      </div>
    </>
  );
};

export default ProfileList;
