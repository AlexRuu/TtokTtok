import { SearchResult } from "@/types";
import getSearchResults from "@/actions/get-search-results";
import Link from "next/link";
import { Book, BookOpen, Layers, PenTool, Tag } from "lucide-react";
import SearchInput from "./components/search-input";
import SearchPageWrapper from "./components/search-page-wrapper";
import { LoadingProvider } from "@/hooks/loading-context";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Ttok Ttok",
};

interface SearchPageProps {
  searchParams?: Promise<{ q?: string }>;
}

const typeLabels: Record<SearchResult["type"], string> = {
  lesson: "Lessons",
  unit: "Units",
  quiz: "Quizzes",
  vocabulary: "Vocabulary",
  tag: "Tags",
};

const icons = {
  lesson: <Book size={18} className="text-[#B59E90]" />,
  unit: <Layers size={18} className="text-[#B59E90]" />,
  quiz: <PenTool size={18} className="text-[#B59E90]" />,
  vocabulary: <BookOpen size={18} className="text-[#B59E90]" />,
  tag: <Tag size={18} className="text-[#B59E90]" />,
};

const order: SearchResult["type"][] = [
  "lesson",
  "quiz",
  "vocabulary",
  "unit",
  "tag",
];

const SearchPage = async (props: SearchPageProps) => {
  const searchParams = await props.searchParams;
  const query = searchParams?.q?.trim() ?? "";
  const hasQuery = query.length > 0;

  const results = hasQuery ? await getSearchResults(query) : null;

  const grouped = results?.reduce<Record<SearchResult["type"], SearchResult[]>>(
    (acc, result) => {
      if (!acc[result.type]) acc[result.type] = [];
      acc[result.type].push(result);
      return acc;
    },
    {} as Record<SearchResult["type"], SearchResult[]>
  );

  return (
    <LoadingProvider>
      <SearchPageWrapper>
        <main className="mx-auto mt-10 max-w-4xl w-full px-4 sm:px-6 py-14 bg-[#FFF9F5] text-[#6B4C3B] rounded-2xl shadow-md space-y-12 mb-10">
          {/* Search Input */}
          <div>
            <SearchInput initialQuery={query} />
          </div>

          {/* No Query */}
          {!hasQuery && (
            <div className="text-center text-[#B59E90]">
              <p className="text-sm">Please enter a search query.</p>
            </div>
          )}

          {/* No Results */}
          {hasQuery && (!results || results.length === 0) && (
            <div className="text-center text-[#B59E90]">
              <p className="text-sm">
                No results found. Try searching something else!
              </p>
            </div>
          )}

          {/* Grouped Results */}
          {hasQuery &&
            grouped &&
            order.map((type) => {
              const items = grouped[type];
              if (!items || items.length === 0) return null;

              return (
                <section
                  key={type}
                  className="bg-white bg-opacity-70 rounded-xl p-6 md:p-8 shadow-sm border border-[#F1E4DB] space-y-4"
                >
                  <h2 className="text-sm font-semibold text-[#B59E90] uppercase tracking-wider border-b border-[#EEDFD3] pb-2">
                    {typeLabels[type]}
                  </h2>

                  <ul
                    className={
                      type === "tag"
                        ? "grid grid-cols-1 sm:grid-cols-2 gap-3"
                        : "space-y-3"
                    }
                  >
                    {items.map((item) => (
                      <li key={item.id}>
                        <Link
                          href={item.href}
                          className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#F9EDEB] border border-transparent hover:border-[#EEDFD3] transition-all duration-150 shadow-sm"
                        >
                          <div className="shrink-0 text-[#B59E90]">
                            {icons[type]}
                          </div>
                          <div className="flex flex-col justify-center overflow-hidden">
                            <p className="font-medium truncate text-[#6B4C3B] leading-tight">
                              {item.title}
                            </p>
                            <p className="text-sm text-[#B59E90] truncate">
                              {item.subtitle}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
        </main>
      </SearchPageWrapper>
    </LoadingProvider>
  );
};

export default SearchPage;
