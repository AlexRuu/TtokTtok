"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useLoading } from "@/hooks/loading-context";

interface FormValues {
  q: string;
}

interface SearchInputProps {
  initialQuery?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ initialQuery = "" }) => {
  const router = useRouter();
  const { isLoading, startLoading } = useLoading();

  const form = useForm<FormValues>({
    defaultValues: { q: initialQuery },
  });

  const query = form.watch("q");

  const onSubmit = (values: FormValues) => {
    const trimmed = values.q.trim();
    if (trimmed) {
      startLoading();
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleClear = () => {
    form.setValue("q", "");
    router.push("/search");
  };

  useEffect(() => {
    form.setValue("q", initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-xl mx-auto mb-8 px-4"
      >
        <div className="relative flex items-center gap-2 shadow-sm rounded-2xl border border-[#EEDFD3] bg-white">
          <FormField
            control={form.control}
            name="q"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B59E90]"
                      size={18}
                    />
                    <Input
                      {...field}
                      placeholder="Search lessons, quizzes, tags..."
                      className="pl-10 pr-10 py-2 text-sm bg-transparent text-[#6B4C3B] border-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                      autoComplete="off"
                    />
                    {query && (
                      <button
                        type="button"
                        onClick={handleClear}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#B59E90] hover:text-[#6B4C3B]"
                        aria-label="Clear search"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="rounded-r-2xl bg-[#EEDFD3] text-[#6B4C3B] hover:bg-[#E5D3C5] text-sm px-4 py-2"
          >
            {isLoading ? "Searching…" : "Search"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SearchInput;
