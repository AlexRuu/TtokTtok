"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useLoading } from "@/hooks/loading-context";

const SearchPageWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { stopLoading } = useLoading();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  useEffect(() => {
    const timer = setTimeout(() => {
      stopLoading();
    }, 50);

    return () => clearTimeout(timer);
  }, [query, stopLoading]);

  return <>{children}</>;
};

export default SearchPageWrapper;
