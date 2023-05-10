import { type NextPage } from "next";

import { MainLayout } from "@/layouts/main";
import { ContentList, Header } from "@/components";

const Home: NextPage = () => {
  return (
    <MainLayout>
      <Header />
      <ContentList />
    </MainLayout>
  );
};

export default Home;
