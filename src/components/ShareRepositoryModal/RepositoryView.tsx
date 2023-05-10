import { type Repository } from "@prisma/client";
import React from "react";

type RepositoryViewProps = {
  repositoryList: Repository[];
  menuItemClassName: (id: number) => string;
  handleItemClick: (id: number) => void;
};
const RepositoryView = ({
  repositoryList,
  menuItemClassName,
  handleItemClick,
}: RepositoryViewProps) => {
  if (repositoryList.length < 1) {
    return <p>There is no repository</p>;
  }

  return (
    <ul className="menu rounded-box menu-compact h-full w-full overflow-y-auto bg-base-100 p-2">
      {repositoryList.map((repository) => (
        <li key={repository.id} onClick={() => handleItemClick(repository.id)}>
          <a className={menuItemClassName(repository.id)}>{repository.name}</a>
        </li>
      ))}
    </ul>
  );
};

export default RepositoryView;
