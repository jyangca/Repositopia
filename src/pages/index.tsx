import { type NextPage } from "next";

import { MainLayout } from "@/layouts/main";
import { Header, ProfileList } from "@/components";

const Home: NextPage = () => {
  return (
    <MainLayout>
      <Header />
      <ProfileList />
    </MainLayout>
  );
};

export default Home;
