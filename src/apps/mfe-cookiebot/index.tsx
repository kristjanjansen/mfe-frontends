import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { registerCustomElement } from "../../utils/utils";
import CookiebotApp from "./CookiebotApp";
import css from "./index.css?inline";

function createClient() {
  const client = new QueryClient();

  return client;
}

function Root() {
  const [client] = React.useState(() => createClient());
  return (
    <QueryClientProvider client={client}>
      <CookiebotApp />
    </QueryClientProvider>
  );
}

registerCustomElement("mfe-cookiebot", Root, { shadow: true, css });
