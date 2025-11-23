import { lazy, Suspense, useEffect } from "react";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./pages/AppLayout";
import Loader from "./components/Loader";
import Error from "./components/Error";
import PageNotFound from "./components/PageNotFound";
import ReportPage from "./pages/ReportPage";
import { initializeSocket, disconnectSocket } from "./utils/socketClient";

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
        path: "/all-notifications/report/:title",
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
  useEffect(() => {
    // Initialize Socket.IO connection when app mounts
    initializeSocket();

    // Cleanup on unmount
    return () => {
      disconnectSocket();
    };
  }, []);

  return (
    <Suspense fallback={<Loader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
