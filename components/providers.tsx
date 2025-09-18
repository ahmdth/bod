"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "../lib/get-querry-client";

export default function Providers({ children, ...props }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  return <QueryClientProvider client={queryClient} {...props}>{children}</QueryClientProvider>;
}