import { LogoGithubIcon } from "@primer/octicons-react";
import { signIn } from "next-auth/react";
import React from "react";

export const UserSignIn = () => {
  const handleClickSignIn = () => void signIn();

  return (
    <React.Fragment>
      <p className="mb-4 max-w-sm text-center">
        Share your Github profile with us!
      </p>

      <button className="btn-primary btn" onClick={handleClickSignIn}>
        Sign in with <LogoGithubIcon className="ml-2" size={16} />
      </button>
    </React.Fragment>
  );
};
