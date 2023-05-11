import React, { useState } from "react";
import RepositoryView from "./RepositoryView";
import { useBrowseRepository } from "./useShareRepository";

type BrowseRepositoryModalProps = {
  username: string;
};
const BrowseRepositoryModal = ({ username }: BrowseRepositoryModalProps) => {
  const {
    data: repositoryList,
    isLoading,
    handlePublish,
  } = useBrowseRepository({
    username,
  });

  console.log(repositoryList);

  const [selected, setSelected] = useState<number>();

  const handleItemClick = (id: number) => {
    if (id === selected) {
      setSelected(undefined);
      return;
    }
    setSelected(id);
  };

  const handleButtonClick = () => {
    const repository = repositoryList?.find(
      (repository) => repository.id === selected
    );

    handlePublish(repository);
  };

  const menuItemClassName = (id: number) => (selected === id ? "active" : "");

  const modalButtonClassName = selected ? "btn-active" : "btn-disabled";

  const ShareButton = () => {
    if (isLoading) {
      return (
        <button className="loading btn-accent btn-wide btn-square btn mb-3"></button>
      );
    }
    return (
      <label
        htmlFor="share-repository-modal"
        className="btn-accent btn-wide btn"
      >
        Share Repository
      </label>
    );
  };

  return (
    <>
      <ShareButton />
      <input
        type="checkbox"
        id="share-repository-modal"
        className="modal-toggle"
      />
      <div className="modal modal-bottom sm:modal-middle">
        <div className="modal-box flex w-full flex-col items-center justify-center gap-3">
          <label
            htmlFor="share-repository-modal"
            className="btn-ghost btn-sm btn-circle btn absolute right-3 top-3"
          >
            ✕
          </label>
          <h3 className="text-lg font-bold">
            Pick your most favorite repository!
          </h3>
          {username && !isLoading && repositoryList ? (
            <RepositoryView
              repositoryList={repositoryList}
              menuItemClassName={menuItemClassName}
              handleItemClick={handleItemClick}
            />
          ) : (
            <button className="loading btn-ghost btn-active btn-square btn"></button>
          )}
          <div className="modal-action">
            <label
              htmlFor="share-repository-modal"
              className={`btn-primary btn-wide btn ${modalButtonClassName}`}
              onClick={handleButtonClick}
            >
              Apply
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default BrowseRepositoryModal;
