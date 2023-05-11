import React, { useState } from "react";
import { ActionButtons, ProfileList, RepositoryList } from "..";

const tabOptions = ["Profile", "Repository"] as const;

export type TabOptionType = (typeof tabOptions)[number];

const Content = () => {
  const [tab, setTab] = useState<TabOptionType>("Profile");

  const handleTabClick = (option: TabOptionType) => {
    setTab(option);
  };

  const tabClassName = (option: TabOptionType) =>
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
      </div>
      {tab === "Profile" && <ProfileList />}
      {tab === "Repository" && <RepositoryList />}
    </section>
  );
};

export default Content;
