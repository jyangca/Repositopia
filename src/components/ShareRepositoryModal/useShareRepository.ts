import { api } from "@/utils/api";

type UseBrowseRepositoryProps = {
  username: string;
};
export const useBrowseRepository = ({ username }: UseBrowseRepositoryProps) => {
  const utils = api.useContext();

  const { data, isLoading } = api.repository.getUserRepository.useQuery({
    username,
  });

  const { mutate: publish, isLoading: isPublishing } =
    api.repository.publish.useMutation({
      onSettled: () => {
        void utils.profile.getPaginated.invalidate();
      },
    });

  return {
    data,
    publish,
    isPublishing,
    isLoading,
  };
};
