import prismadb from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.trim();

    if (!query || query.length === 0) {
      return NextResponse.json({ results: [] });
    }

    // Full-text search using raw SQL with relevance scoring
    const lessons = await prismadb.$queryRaw<
      Array<{
        id: string;
        title: string;
        lessonNumber: number;
        slug: string;
        unitNumber: number;
        score: number;
      }>
    >`
      SELECT l.id, l.title, l."lessonNumber", l.slug, u."unitNumber",
        ts_rank(to_tsvector('english', l.title), plainto_tsquery('english', ${query})) AS score
      FROM public."Lesson" l
      JOIN public."Unit" u ON l."unitId" = u.id
      WHERE to_tsvector('english', l.title) @@ plainto_tsquery('english', ${query})
      ORDER BY score DESC
      LIMIT 10;
    `;

    const units = await prismadb.$queryRaw<
      Array<{ id: string; title: string; unitNumber: number; score: number }>
    >`
      SELECT id, title, "unitNumber",
        ts_rank(to_tsvector('english', title), plainto_tsquery('english', ${query})) AS score
      FROM public."Unit"
      WHERE to_tsvector('english', title) @@ plainto_tsquery('english', ${query})
      ORDER BY score DESC
      LIMIT 10;
    `;

    const quizzes = await prismadb.$queryRaw<
      Array<{
        id: string;
        title: string;
        lessonSlug: string;
        lessonNumber: number;
        score: number;
      }>
    >`
      SELECT q.id, q.title, l.slug AS "lessonSlug", l."lessonNumber",
        ts_rank(to_tsvector('english', q.title), plainto_tsquery('english', ${query})) AS score
      FROM public."Quiz" q
      JOIN public."Lesson" l ON q."lessonId" = l.id
      WHERE to_tsvector('english', q.title) @@ plainto_tsquery('english', ${query})
      ORDER BY score DESC
      LIMIT 10;
    `;

    const vocabLists = await prismadb.$queryRaw<
      Array<{
        id: string;
        title: string;
        lessonSlug: string;
        lessonNumber: number;
        score: number;
      }>
    >`
      SELECT v.id, v.title, l.slug AS "lessonSlug", l."lessonNumber",
        ts_rank(to_tsvector('english', v.title), plainto_tsquery('english', ${query})) AS score
      FROM public."VocabularyList" v
      JOIN public."Lesson" l ON v."lessonId" = l.id
      WHERE to_tsvector('english', v.title) @@ plainto_tsquery('english', ${query})
      ORDER BY score DESC
      LIMIT 10;
    `;

    const tags = await prismadb.$queryRaw<
      Array<{ id: string; name: string; score: number }>
    >`
      SELECT id, name,
        ts_rank(to_tsvector('english', name), plainto_tsquery('english', ${query})) AS score
      FROM public."Tag"
      WHERE to_tsvector('english', name) @@ plainto_tsquery('english', ${query})
      ORDER BY score DESC
      LIMIT 10;
    `;

    // Standardize results
    const results = [
      ...lessons.map((lesson) => ({
        id: lesson.id,
        title: `${lesson.lessonNumber}. ${lesson.title}`,
        subtitle: `Unit ${lesson.unitNumber}`,
        href: `/lessons/${lesson.slug}`,
        type: "lesson",
        score: lesson.score,
      })),
      ...units.map((unit) => ({
        id: unit.id,
        title: `Unit ${unit.unitNumber}: ${unit.title}`,
        subtitle: "Unit",
        href: `/unit/${unit.id}`,
        type: "unit",
        score: unit.score,
      })),
      ...quizzes.map((quiz) => ({
        id: quiz.id,
        title: quiz.title,
        subtitle: `Lesson ${quiz.lessonNumber} Quiz`,
        href: `/lesson/${quiz.lessonSlug}/quiz`,
        type: "quiz",
        score: quiz.score,
      })),
      ...vocabLists.map((vocab) => ({
        id: vocab.id,
        title: vocab.title,
        subtitle: `Lesson ${vocab.lessonNumber} Vocabulary`,
        href: `/lesson/${vocab.lessonSlug}/vocabulary`,
        type: "vocabulary",
        score: vocab.score,
      })),
      ...tags.map((tag) => ({
        id: tag.id,
        title: tag.name,
        subtitle: "Tag",
        href: `/tags/${tag.name}`,
        type: "tag",
        score: tag.score,
      })),
    ];

    // Sort all results by score descending for final ranking
    results.sort((a, b) => (b.score || 0) - (a.score || 0));

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error(
      "There was an error with searching for related queries.",
      error
    );
    return new NextResponse(
      "There was an error with searching for related queries.",
      { status: 500 }
    );
  }
}
