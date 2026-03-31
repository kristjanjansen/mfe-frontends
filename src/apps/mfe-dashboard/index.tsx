import React from "react";
import { registerCustomElement } from "../../utils/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DashboardApp from "./DashboardApp";
import css from "./index.css?inline";

function createClient() {
  const client = new QueryClient();

  return client;
}

function Root() {
  const [client] = React.useState(() => createClient());
  return (
    <QueryClientProvider client={client}>
      <DashboardApp />
    </QueryClientProvider>
  );
}

registerCustomElement("mfe-dashboard", Root, { shadow: true, css });
