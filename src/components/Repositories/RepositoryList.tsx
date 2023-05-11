import { RepositoryItem } from "./RepositoryItem";
import { useProfilesPaginated } from "./useRepositoryPaginated";

const PAGE_SIZE = 8;

const RepositoryList = () => {
  const { repositoryPages, isFetchingNextPage, ref, handleUnpublish } =
    useProfilesPaginated({
      pageSize: PAGE_SIZE,
    });

  return (
    <>
      <ul className="flex flex-col overflow-hidden rounded-md border border-gray-600">
        {repositoryPages?.pages?.map((page, pageIndex) =>
          page.repositories.map((repository, profileIndex) => (
            <li
              className="border-b border-b-gray-600 bg-base-300 p-4 last:border-b-0"
              key={repository.id}
            >
              <RepositoryItem
                handleUnpublish={handleUnpublish}
                repository={repository}
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

export default RepositoryList;
