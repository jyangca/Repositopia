import { ProfileItem } from "./RepositoryItem";
import { useProfilesPaginated } from "./useRepositoryPaginated";

const PAGE_SIZE = 8;

const ProfileList = () => {
  const { profiles, isFetchingNextPage, isEmpty, ref } = useProfilesPaginated({
    pageSize: PAGE_SIZE,
  });

  return (
    <section className="mx-auto mb-8 mt-2 cursor-default px-4 md:container md:max-w-4xl">
      {isEmpty ? (
        <div className="text-center">
          <p className="text-2xl font-medium text-gray-300">
            No profiles found
          </p>
          <p>Be the first to share your github profile</p>
        </div>
      ) : (
        <>
          <div className="flex items-baseline justify-between px-4 py-2">
            <p className="text-xs">Ordered by number of followers</p>
          </div>
          <ul className="flex flex-col overflow-hidden rounded-md border border-gray-600">
            {profiles?.pages?.map((page, pageIndex) =>
              page.profiles.map((profile, profileIndex) => (
                <li
                  className="border-b border-b-gray-600 bg-gray-800/80 p-4 last:border-b-0"
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
      )}
    </section>
  );
};

export default ProfileList;
