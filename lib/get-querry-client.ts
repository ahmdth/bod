import { QueryClient } from "@tanstack/react-query";

function makeQueryClient(){
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;
export function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}