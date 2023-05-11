import { useCallback, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { api } from "@/utils/api";
import toast from "react-hot-toast";

export function useProfilesPaginated({ pageSize = 8 }) {
  const {
    data: repositoryPages,
    fetchNextPage,
    isFetchingNextPage,
  } = api.repository.getPaginated.useInfiniteQuery(
    {
      limit: pageSize,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      staleTime: 1000 * 60 * 5,
    }
  );

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      void fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  const isEmpty = repositoryPages?.pages?.length === 0;

  const { mutate: unpublish, isLoading: isUnpublishing } =
    api.repository.unpublish.useMutation();

  const utils = api.useContext();

  const handleUnpublish = useCallback((id: number) => {
    unpublish(
      { id },
      {
        onSettled: () => {
          void utils.repository.getPaginated.invalidate();
        },
        onSuccess: () => toast.success("Repository removed."),
      }
    );
  }, []);

  return {
    repositoryPages,
    isFetchingNextPage,
    isUnpublishing,
    isEmpty,
    handleUnpublish,
    ref,
  };
}
