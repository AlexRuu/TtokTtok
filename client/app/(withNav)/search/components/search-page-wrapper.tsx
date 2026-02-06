"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import useLoading from "@/hooks/use-loading";
import Loader from "@/components/ui/loader";

const SearchPageWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isLoading, stopLoading, startLoading } = useLoading();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const [lastQuery, setLastQuery] = useState(query);
  useEffect(() => {
    if (query && query !== lastQuery) {
      startLoading();
      setLastQuery(query);
    } else {
      stopLoading();
    }
  }, [query, lastQuery]);

  useEffect(() => {
    console.log(isLoading);
  }, [isLoading]);

  return <>{isLoading ? <Loader /> : children}</>;
};

export default SearchPageWrapper;
