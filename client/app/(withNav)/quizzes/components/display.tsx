"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type QuizWithRelations = {
  id: string;
  title: string;
  lesson: {
    id: string;
    title: string;
    unit: { id: string; title: string };
  };
  tagging?: { tag: { id: string; name: string } }[];
};

type GroupedQuizzes = Record<
  string,
  {
    title: string; // unit title
    lessons: Record<
      string,
      {
        title: string; // lesson title
        quizzes: QuizWithRelations[];
      }
    >;
  }
>;

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const lessonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

const quizVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 20 },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

const tagVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 20 },
  },
};

const QuizDisplay = ({ quizzes }: { quizzes: QuizWithRelations[] }) => {
  const grouped: GroupedQuizzes = quizzes.reduce<GroupedQuizzes>(
    (acc, quiz) => {
      const unitId = quiz.lesson.unit.id;
      if (!acc[unitId])
        acc[unitId] = { title: quiz.lesson.unit.title, lessons: {} };

      const lessonId = quiz.lesson.id;
      if (!acc[unitId].lessons[lessonId])
        acc[unitId].lessons[lessonId] = {
          title: quiz.lesson.title,
          quizzes: [],
        };

      acc[unitId].lessons[lessonId].quizzes.push(quiz);
      return acc;
    },
    {} as GroupedQuizzes
  );

  return (
    <div className="space-y-10">
      {Object.entries(grouped).map(([unitId, unit]) => (
        <section
          key={unitId}
          id={`unit-${unitId}`}
          className="space-y-6 scroll-mt-24"
        >
          {/* Unit Header */}
          <motion.h2
            className="flex items-center text-xl font-bold text-[#5A3F2C] mt-6"
            variants={headerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {unit.title}
          </motion.h2>

          {Object.entries(unit.lessons).map(([lessonId, lesson]) => (
            <motion.div
              key={lessonId}
              id={`lesson-${lessonId}`}
              variants={lessonVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="bg-[#FFF8F3] p-4 rounded-2xl border border-[#FFE4D6] shadow-sm space-y-3"
            >
              <h3 className="text-md font-semibold text-[#6B4C3B]">
                {lesson.title}
              </h3>

              <motion.div variants={containerVariants} className="space-y-2">
                {lesson.quizzes.map((quiz) => (
                  <motion.div
                    key={quiz.id}
                    variants={quizVariants}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white p-3 rounded-xl shadow border border-[#FFEDE2] flex flex-col sm:flex-row sm:items-center justify-between"
                  >
                    <Link
                      href={`/quizzes/${quiz.id}`}
                      className="font-medium text-sm text-[#6B4C3B] hover:underline"
                    >
                      {quiz.title}
                    </Link>

                    {quiz.tagging && quiz.tagging.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                        {quiz.tagging.map((t) => (
                          <motion.span
                            key={t.tag.id}
                            variants={tagVariants}
                            className="px-2 py-0.5 rounded-full bg-[#FFEDE2] text-sm text-[#6B4C3B]"
                          >
                            {t.tag.name}
                          </motion.span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </section>
      ))}
    </div>
  );
};

export default QuizDisplay;
