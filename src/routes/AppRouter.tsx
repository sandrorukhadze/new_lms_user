import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import type { RouteObject } from "react-router-dom";

import Layout from "../layouts/layout";
import UserInfo from "../pages/UserInfo";
import NotFound from "../pages/NotFound";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/me" replace />,
      },
      {
        path: "me",
        element: <UserInfo />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

const AppRouter = () => <RouterProvider router={router} />;

export default AppRouter;
