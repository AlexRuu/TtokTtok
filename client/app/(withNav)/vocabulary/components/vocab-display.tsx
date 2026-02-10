"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";

type VocabularyWithRelations = {
  id: string;
  title: string;
  lesson: {
    id: string;
    title: string;
    slug: string;
    unit: { id: string; title: string; slug: string };
  };
  tagging?: { tag: { id: string; name: string } }[];
};

type GroupedVocabulary = Record<
  string,
  {
    title: string;
    lessons: Record<
      string,
      {
        title: string;
        vocabularyList: VocabularyWithRelations[];
      }
    >;
  }
>;

const headerVariants: Variants = {
  hidden: { opacity: 0, y: -5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

const lessonVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

const vocabularyVariants: Variants = {
  hidden: { opacity: 0, y: 5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 20 },
  },
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const tagVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 120, damping: 20 },
  },
};

const VocabularyDisplay = ({
  vocabularyList,
}: {
  vocabularyList: VocabularyWithRelations[];
}) => {
  const grouped: GroupedVocabulary = vocabularyList.reduce<GroupedVocabulary>(
    (acc, vocabulary) => {
      const unitId = vocabulary.lesson.unit.id;
      if (!acc[unitId])
        acc[unitId] = { title: vocabulary.lesson.unit.title, lessons: {} };

      const lessonId = vocabulary.lesson.id;
      if (!acc[unitId].lessons[lessonId])
        acc[unitId].lessons[lessonId] = {
          title: vocabulary.lesson.title,
          vocabularyList: [],
        };

      acc[unitId].lessons[lessonId].vocabularyList.push(vocabulary);
      return acc;
    },
    {} as GroupedVocabulary,
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
                {lesson.vocabularyList.map((vocabulary) => (
                  <motion.div
                    key={vocabulary.id}
                    variants={vocabularyVariants}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white p-3 rounded-xl shadow border border-[#FFEDE2] flex flex-col sm:flex-row sm:items-center justify-between"
                  >
                    <Link
                      href={`/units/${vocabulary.lesson.unit.slug}/lessons/${vocabulary.lesson.slug}/quiz`}
                      className="font-medium text-sm text-[#6B4C3B] hover:underline"
                    >
                      {vocabulary.title}
                    </Link>

                    {vocabulary.tagging && vocabulary.tagging.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                        {vocabulary.tagging.map((t) => (
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

export default VocabularyDisplay;
