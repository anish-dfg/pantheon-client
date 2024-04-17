import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "~/App";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Auth0Provider } from "@auth0/auth0-react";

import "~/dist.css";
import { Protected } from "./components/auth/Protected";
import { DashboardPage } from "./pages/DashboardPage";
import { UsersPage } from "./pages/UsersPage";
import { Navbar } from "./components/navigation/Navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { DatasourceViewPage } from "./pages/DatasourceViewPage";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/dashboard",
    element: <Protected component={DashboardPage} />,
  },
  {
    path: "/users",
    element: <Protected component={UsersPage} />,
  },
  {
    path: "/database/:datasource/:id",
    element: <Protected component={DatasourceViewPage} />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Auth0Provider
        clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
        domain={import.meta.env.VITE_AUTH0_DOMAIN}
        authorizationParams={{
          redirect_uri: window.location.origin + "/dashboard",
          audience: "https://pantheon.developforgood.org/api",
        }}
      >
        <Toaster />
        <Navbar />
        <RouterProvider router={router} />
      </Auth0Provider>
    </QueryClientProvider>
  </React.StrictMode>,
);
