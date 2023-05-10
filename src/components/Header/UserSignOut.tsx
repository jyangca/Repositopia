import { type User } from "next-auth/core/types";
import { signOut } from "next-auth/react";
import React from "react";
import Image from "next/image";

type UserSignOutProps = {
  user: User;
};
const UserSignOut = ({ user }: UserSignOutProps) => {
  const handleClickSingOut = () => void signOut();

  if (!user.name || !user.image) return null;

  return (
    <>
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
    </>
  );
};

export default UserSignOut;
