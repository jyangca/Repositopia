import { useState } from "react";
import { ProfileItem } from "./ProfileItem";
import { useProfilesPaginated } from "./useProfilePaginated";

const PAGE_SIZE = 8;

const tabOptions = ["Profile", "Repository"] as const;
const sortOptions = ["Stars", "Latest", "Oldest"] as const;

const ProfileList = () => {
  const { profiles, isFetchingNextPage, isEmpty, ref } = useProfilesPaginated({
    pageSize: PAGE_SIZE,
  });
  const [tab, setTab] = useState<(typeof tabOptions)[number]>("Profile");
  const [sortBy, setSortBy] = useState<(typeof sortOptions)[number]>("Latest");

  const handleSortClick = (option: (typeof sortOptions)[number]) => {
    setSortBy(option);
  };

  const handleTabClick = (option: (typeof tabOptions)[number]) => {
    setTab(option);
  };

  const tabClassName = (option: (typeof tabOptions)[number]) =>
    tab === option ? "tab tab-active" : "tab";

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
          <div className="flex flex-row items-baseline justify-between px-4 py-2">
            <div className="tabs tabs-boxed">
              {tabOptions.map((option) => (
                <a
                  key={option}
                  className={tabClassName(option)}
                  onClick={() => handleTabClick(option)}
                >
                  {option}
                </a>
              ))}
            </div>
            <div className="flex flex-row gap-3">
              <div className="dropdown-bottom dropdown-end dropdown-hover dropdown">
                <label tabIndex={0} className="btn-ghost btn-xs btn m-1">
                  Sort by
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
                >
                  {sortOptions.map((option) => (
                    <li key={option} onClick={() => handleSortClick(option)}>
                      <a>{option}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="prose-sm prose-stone prose">{sortBy}</div>
            </div>
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
