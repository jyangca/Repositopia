import React, { useState } from "react";
import { ActionButtons, ProfileList, RepositoryList } from "..";

const tabOptions = ["Profile", "Repository"] as const;
const sortOptions = ["Stars", "Latest", "Oldest"] as const;

const Content = () => {
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
      <ActionButtons tab={tab} />
      <div className="flex w-full flex-row items-baseline justify-between px-4 py-2">
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
        <div className="flex w-40 flex-row items-center justify-between">
          <div className="dropdown-bottom dropdown-end dropdown-hover dropdown">
            <label tabIndex={0} className="btn-ghost btn-xs btn">
              Sort by
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu rounded-box menu-compact w-52 bg-base-100 p-2 shadow"
            >
              {sortOptions.map((option) => (
                <li key={option} onClick={() => handleSortClick(option)}>
                  <a>{option}</a>
                </li>
              ))}
            </ul>
          </div>
          <h5 className="text-sm font-bold">{sortBy}</h5>
        </div>
      </div>
      {tab === "Profile" && <ProfileList />}
      {tab === "Repository" && <RepositoryList />}
    </section>
  );
};

export default Content;