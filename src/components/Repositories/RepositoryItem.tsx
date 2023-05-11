import { transformNumberFormat } from "@/utils/common";
import { EyeIcon, StarIcon } from "@primer/octicons-react";
import type { Repository } from "@prisma/client";
import { Info } from "@/components";

type RepositoryItemProps = {
  repository: Repository;
  position: number;
  handleUnpublish: (id: number) => void;
};

export const RepositoryItem = ({
  repository,
  handleUnpublish,
}: RepositoryItemProps) => {
  return (
    <div className="flex gap-4">
      <div className="flex w-full flex-col gap-2">
        {/* Name & Url */}
        <div className="flex items-baseline gap-2">
          <a
            href={`https://github.com/${repository.url}`}
            target="_blank"
            className="text-xl font-semibold leading-6 hover:underline"
            rel="noreferrer"
          >
            {repository.name}
          </a>
          {repository.owner_name && (
            <a
              href={`https://github.com/${repository.owner_name}`}
              target="_blank"
              className="text-xl font-semibold leading-6 hover:underline"
              rel="noreferrer"
            >
              <p className="text-base leading-4">{repository.owner_name}</p>
            </a>
          )}
        </div>
        {/* Description */}
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:gap-6">
          {repository.description && (
            <div className="">
              <p className="max-w-[45ch] text-sm">{repository.description}</p>
            </div>
          )}

          <div className="flex w-52 flex-col gap-1 whitespace-nowrap">
            <Info icon={<StarIcon />}>
              <span className="text-md font-semibold">
                {transformNumberFormat(repository.star_count)}
              </span>
              followers
            </Info>

            <Info icon={<EyeIcon />}>
              <span className="text-md font-semibold">
                {transformNumberFormat(repository.watcher_count)}
              </span>
              watchers
            </Info>
          </div>
        </div>
      </div>
      <button
        className="btn-outline btn-square btn"
        onClick={() => handleUnpublish(repository.id)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};
