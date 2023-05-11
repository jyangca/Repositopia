import { api } from "@/utils/api";
import { type Repository } from "@prisma/client";
import { useCallback } from "react";
import toast from "react-hot-toast";

type UseBrowseRepositoryProps = {
  username: string;
};
export const useBrowseRepository = ({ username }: UseBrowseRepositoryProps) => {
  const utils = api.useContext();

  const { data, isLoading: isFetching } =
    api.repository.getUserRepository.useQuery(
      {
        username,
      },
      { staleTime: 1000 * 60 * 60 * 24 }
    );

  const { mutate: publish, isLoading: isPublishing } =
    api.repository.publish.useMutation({
      onSettled: () => {
        void utils.repository.getPaginated.invalidate();
      },
      onSuccess: () => toast.success("Repository published!"),
    });

  const { mutate: unpublish, isLoading: isUnpublishing } =
    api.repository.unpublish.useMutation();

  const handlePublish = useCallback((repository?: Repository) => {
    if (repository) {
      unpublish({ ownerName: repository.owner_name });
      publish({ repository });
      return;
    }
  }, []);

  return {
    data,
    handlePublish,
    isLoading: isPublishing || isFetching || isUnpublishing,
  };
};
