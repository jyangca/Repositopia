import { useSession } from "next-auth/react";
import type { PropsWithChildren } from "react";
import UserSignIn from "./UserSignIn";
import UserSignOut from "./UserSignOut";

const Header = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Wrapper>
        <button className="loading btn-ghost btn-active btn-square btn"></button>
      </Wrapper>
    );
  }

  if (!session?.user) {
    return (
      <Wrapper>
        <UserSignIn />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <UserSignOut user={session.user} />
    </Wrapper>
  );
};

const Wrapper = ({ children }: PropsWithChildren) => (
  <header className="flex cursor-default flex-col items-center">
    <h1 className="pb-7 text-5xl font-semibold">Repositopia</h1>
    {children}
  </header>
);

export default Header;
