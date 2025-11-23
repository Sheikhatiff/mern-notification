import React from "react";
import { Outlet, useNavigation } from "react-router-dom";
import Header from "../components/Header";
import Loader from "../components/Loader";
function AppLayout() {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-stone-800">
      <div className="shrink-0 mx-4">
        <Header />
      </div>
      <div className="flex-1 overflow-hidden">
        <main className="h-full relative">
          {isLoading && <Loader />}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
export default AppLayout;
