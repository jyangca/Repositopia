import { type NextPage } from "next";

import { MainLayout } from "@/layouts/main";
import { Header, RepositoryList } from "@/components";

const Home: NextPage = () => {
  return (
    <MainLayout>
      <Header />
      <RepositoryList />
    </MainLayout>
  );
};

export default Home;
