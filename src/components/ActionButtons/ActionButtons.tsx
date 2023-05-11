import { useSession } from "next-auth/react";
import React, { memo } from "react";
import { ShareRepositoryModal } from "..";
import { useShareProfile } from "./useShareProfile";

type ActionButotnsProps = {
  tab: "Profile" | "Repository";
};
const ActionButotns = ({ tab }: ActionButotnsProps) => {
  const { handlePublish, isPublished, isLoading } = useShareProfile();
  const { data: session } = useSession();

  const username = session?.user?.name;

  const ShareButton = () => {
    if (!session?.user) return null;
    if (isLoading) {
      return (
        <button className="loading btn-accent btn-wide btn-square btn mb-3"></button>
      );
    }
    return (
      <button className="btn-accent btn-wide btn" onClick={handlePublish}>
        {isPublished ? "Unshare" : "Share Profile"}
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center">
      {tab === "Profile" && <ShareButton />}
      {tab === "Repository" && username && (
        <ShareRepositoryModal username={username} />
      )}
    </div>
  );
};

export default memo(ActionButotns);
