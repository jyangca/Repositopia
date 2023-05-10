import { type User } from "next-auth/core/types";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import Image from "next/image";
import { useShareProfile } from "./useShareProfile";
import { BrowseRepositoryModal } from "..";

type UserSignOutProps = {
  user: User;
};
const UserSignOut = ({ user }: UserSignOutProps) => {
  const handleClickSingOut = () => void signOut();
  const { handlePublish, isPublished, isLoading } = useShareProfile();
  const { data: session } = useSession();

  const username = session?.user?.name;

  if (!user.name || !user.image) return null;

  const ShareButton = () => {
    if (isLoading) {
      return (
        <button className="loading btn-accent btn-wide btn-square btn mb-3"></button>
      );
    }
    return (
      <button
        className="btn-accent btn-wide btn-square btn mb-3"
        onClick={handlePublish}
      >
        {isPublished ? "Unshare" : "Share"}
      </button>
    );
  };

  return (
    <React.Fragment>
      <a
        target="_blank"
        href={`https://github.com/${user.name}`}
        rel="noreferrer"
      >
        <Image
          src={user.image}
          alt={user.name}
          width={100}
          height={100}
          className="h-30 w-30 mb-3 rounded-lg shadow-xl"
        />
      </a>
      <p className="text-l mb-1 font-light">{`Nice to meet you, ${user.name}`}</p>
      <button
        className="btn-outline btn-error btn-xs btn mb-3"
        onClick={handleClickSingOut}
      >
        Log out
      </button>
      <ShareButton />
      {username && <BrowseRepositoryModal username={username} />}
    </React.Fragment>
  );
};

export default UserSignOut;
