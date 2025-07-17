import { SearchResult } from "@/types";
import getSearchResults from "@/actions/get-search-results";
import Link from "next/link";
import { Book, BookOpen, Layers, PenTool, Tag } from "lucide-react";

interface SearchPageProps {
  searchParams?: { q?: string };
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

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const query = searchParams?.q?.trim() ?? "";

  if (!query) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-[#6B4C3B]">
        <p>Please enter a search query.</p>
      </div>
    );
  }

  const results = await getSearchResults(query);

  if (!results || results.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-[#B59E90]">
        <p>No results found for &quot;{query}&quot;.</p>
      </div>
    );
  }

  // Group results by type
  const grouped = results.reduce<Record<SearchResult["type"], SearchResult[]>>(
    (acc, result) => {
      if (!acc[result.type]) acc[result.type] = [];
      acc[result.type].push(result);
      return acc;
    },
    {} as Record<SearchResult["type"], SearchResult[]>
  );

  const order: SearchResult["type"][] = [
    "lesson",
    "quiz",
    "vocabulary",
    "unit",
    "tag",
  ];

  return (
    <main className="max-w-4xl mx-auto p-6 text-[#6B4C3B]">
      <h1 className="mb-6 text-2xl font-semibold">
        Search Results for &quot;{query}&quot;
      </h1>

      {order.map((type) => {
        const items = grouped[type];
        if (!items || items.length === 0) return null;

        return (
          <section key={type} className="mb-8">
            <h2 className="mb-2 text-sm font-semibold text-[#B59E90] uppercase tracking-wide">
              {typeLabels[type]}
            </h2>
            <ul className="space-y-2">
              {items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-[#F9EDEB] transition"
                  >
                    <div>{icons[type]}</div>
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-sm text-[#B59E90]">{item.subtitle}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </main>
  );
};

export default SearchPage;
