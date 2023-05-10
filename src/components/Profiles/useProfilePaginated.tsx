import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { api } from "@/utils/api";

export function useProfilesPaginated({ pageSize = 8 }) {
  const {
    data: profiles,
    fetchNextPage,
    isFetchingNextPage,
  } = api.profile.getPaginated.useInfiniteQuery(
    {
      limit: pageSize,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      void fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  const isEmpty = profiles?.pages?.length === 0;

  return {
    profiles,
    isFetchingNextPage,
    isEmpty,
    ref,
  };
}
