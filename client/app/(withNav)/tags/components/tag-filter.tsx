"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { GroupedSearchResults } from "@/types";
import getSearchTagsResults from "@/actions/get-search-tags";
import toast from "react-hot-toast";
import Loader from "@/components/ui/loader";
import Link from "next/link";
import useDebounce from "@/hooks/debounce";

interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  allTags: Tag[];
}

const slugify = (str: string) =>
  str
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

const TagFilterClient = ({ allTags }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [results, setResults] = useState<GroupedSearchResults | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedSlugs = useMemo(() => {
    return (
      searchParams
        .get("tags")
        ?.split(",")
        .map((slug) => slug.toLowerCase().trim())
        .filter(Boolean) ?? []
    );
  }, [searchParams]);

  const debouncedSlugs = useDebounce(selectedSlugs, 300);

  const tagsWithSlugs = useMemo(() => {
    return allTags.map((tag) => ({
      ...tag,
      slug: slugify(tag.name),
    }));
  }, [allTags]);

  const toggleTag = (slug: string) => {
    const currentParams = new URLSearchParams(window.location.search);
    const currentTags =
      currentParams.get("tags")?.split(",").filter(Boolean) ?? [];
    const newTags = currentTags.includes(slug)
      ? currentTags.filter((s) => s !== slug)
      : [...currentTags, slug];

    const query =
      newTags.length > 0
        ? `?tags=${newTags.map(encodeURIComponent).join(",")}`
        : "";
    router.push(`/tags${query}`);
  };

  useEffect(() => {
    const fetchResults = async () => {
      if (debouncedSlugs.length === 0) {
        setResults(null);
        return;
      }

      setLoading(true);
      try {
        const data = await getSearchTagsResults(debouncedSlugs.join(","));
        setResults(data);
      } catch {
        toast.error("Failed to load results. Please try again.");
        setResults(null);
      }
      setLoading(false);
    };

    fetchResults();
  }, [debouncedSlugs]);

  return (
    <>
      {/* Tag Chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tagsWithSlugs.map((tag) => (
          <button
            key={tag.id}
            onClick={() => toggleTag(tag.slug)}
            aria-pressed={selectedSlugs.includes(tag.slug)}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-normal border transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-[#A65A3A]",
              selectedSlugs.includes(tag.slug)
                ? "bg-[#F8E6DC] text-[#A65A3A] border-[#D69E78]"
                : "bg-white hover:bg-[#F9F4F2] text-[#6B4C3B] border-[#EADBD3]"
            )}
          >
            {tag.name}
          </button>
        ))}
        {selectedSlugs.length > 0 && (
          <button
            onClick={() => router.push("/tags")}
            className="text-xs text-[#A65A3A] hover:underline ml-3 self-center"
            aria-label="Clear all selected tags"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Results */}
      {loading && <Loader />}
      {!loading &&
        results &&
        !results.lessons.length &&
        !results.quizzes.length &&
        !results.vocabulary.length && (
          <div className="bg-white rounded-xl p-4 space-y-6 border border-[#F3E7DF] mt-10">
            <p className="text-center text-[#6B4C3B]/60 italic text-md">
              No results found for selected tags.
            </p>
          </div>
        )}

      {!loading &&
        results &&
        (results.lessons.length > 0 ||
          results.quizzes.length > 0 ||
          results.vocabulary.length > 0) && (
          <div className="bg-[#FAF3EF] rounded-2xl p-4 space-y-6 border border-[#EAD6CB] shadow-sm">
            {/* Lessons */}
            {results.lessons.length > 0 && (
              <section className="bg-white rounded-2xl shadow-sm border border-[#F3E7DF] p-4">
                <h2 className="text-base font-medium text-[#6B4C3B] mb-3 border-b border-[#EADBD3] pb-1">
                  Lessons
                </h2>
                <ul className="space-y-2">
                  {results.lessons.map((item) => (
                    <li
                      key={item.id}
                      className="pt-2 border-t border-[#F3E7DF] first:border-none"
                    >
                      <Link
                        href={item.href}
                        className="text-[#A65A3A] hover:underline text-sm font-medium"
                      >
                        {item.title}
                      </Link>
                      {item.subtitle && (
                        <p className="text-xs text-[#6B4C3B]/70 italic mt-1.5">
                          {item.subtitle}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {/* Quizzes */}
            {results.quizzes.length > 0 && (
              <section className="bg-white rounded-2xl shadow-sm border border-[#F3E7DF] p-4">
                <h2 className="text-base font-medium text-[#6B4C3B] mb-3 border-b border-[#EADBD3] pb-1">
                  Quizzes
                </h2>
                <ul className="space-y-2">
                  {results.quizzes.map((item) => (
                    <li
                      key={item.id}
                      className="pt-2 border-t border-[#F3E7DF] first:border-none"
                    >
                      <Link
                        href={item.href}
                        className="text-[#A65A3A] hover:underline text-sm font-medium"
                      >
                        {item.title}
                      </Link>
                      {item.subtitle && (
                        <p className="text-xs text-[#6B4C3B]/70 italic mt-1.5">
                          {item.subtitle}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Vocabulary */}
            {results.vocabulary.length > 0 && (
              <section className="bg-white rounded-2xl shadow-sm border border-[#F3E7DF] p-4">
                <h2 className="text-base font-medium text-[#6B4C3B] mb-3 border-b border-[#EADBD3] pb-1">
                  Vocabulary
                </h2>
                <ul className="space-y-2">
                  {results.vocabulary.map((item) => (
                    <li
                      key={item.id}
                      className="pt-2 border-t border-[#F3E7DF] first:border-none"
                    >
                      <Link
                        href={item.href}
                        className="text-[#A65A3A] hover:underline text-sm font-medium"
                      >
                        {item.title}
                      </Link>
                      {item.subtitle && (
                        <p className="text-xs text-[#6B4C3B]/70 italic mt-1.5">
                          {item.subtitle}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
    </>
  );
};

export default TagFilterClient;
