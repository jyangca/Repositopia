import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { api } from "@/utils/api";

export function useProfilesPaginated({ pageSize = 8 }) {
  const {
    data: profilePages,
    fetchNextPage,
    isFetchingNextPage,
  } = api.profile.getPaginated.useInfiniteQuery(
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

  const isEmpty = profilePages?.pages?.length === 0;

  return {
    profilePages,
    isFetchingNextPage,
    isEmpty,
    ref,
  };
}
