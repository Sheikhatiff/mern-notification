import { lazy, Suspense } from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./pages/AppLayout";
import Loader from "./components/Loader";
import Error from "./components/Error";
import PageNotFound from "./components/PageNotFound";
import ReportPage from "./pages/ReportPage";

const HomePage = lazy(() => import("./pages/HomePage"));
const NotificationPage = lazy(() => import("./pages/NotificationPage"));

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/all-notifications",
        element: <NotificationPage />,
      },
      {
        path: "/all-notifications/repor t/:title",
        element: <ReportPage />,
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
    ],
  },
]);
function App() {
  return (
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
