import { api } from "@/utils/api";
import { toast } from "react-hot-toast";

export function useShareProfile() {
  const { data: profile, isLoading: isLoadingProfile } =
    api.profile.me.useQuery();
  const utils = api.useContext();

  const { mutate: publish, isLoading: isPublishing } =
    api.profile.publish.useMutation({
      onSettled: () => {
        void utils.profile.me.invalidate();
        void utils.profile.getPaginated.invalidate();
      },
      onSuccess: () => toast.success("Profile published!"),
    });

  const { mutate: unpublish, isLoading: isUnpublishing } =
    api.profile.unpublish.useMutation({
      onSettled: () => {
        void utils.profile.me.invalidate();
        void utils.profile.getPaginated.invalidate();
      },
      onSuccess: () => toast.success("Profile unpublished!"),
    });

  const isPublished = profile?.published;

  const handlePublish = () => {
    if (isPublished) {
      unpublish();
    } else {
      publish();
    }
  };

  return {
    profile,
    isLoading: isLoadingProfile || isPublishing || isUnpublishing,
    isPublished,
    handlePublish,
  };
}
