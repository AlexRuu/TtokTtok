"use client";
import { motion } from "framer-motion";

const timelineData = [
  {
    title: "Wanting to Learn Korean",
    description:
      "I started this journey wanting to learn a new language. I've been told, learning to read and write would be super easy... Technically not wrong. But that gave me a false sense of confidence.",
    date: "January 2020",
  },
  {
    title: "Starting Out",
    description:
      "Starting to look for resources, asked for help, learned how to read and write. It was going great.",
    date: "March 2020",
  },
  {
    title: "Long Break Because of... Events.",
    description:
      "Some... global event happened, and learning Korean was put on pause.",
    date: "April 2020",
  },
  {
    title: "Resume The Lessons",
    description:
      "Things began to stabilize and at this point, why not continue my lessons as it was going smoothly?",
    date: "October 2020",
  },
  {
    title: "Constant Demotivation and Life Happened",
    description:
      "Long story short, the next few years were a constant battle with motivation to continue and just life made it hard to set aside time to learn.",
    date: "January 2021",
  },
  {
    title: "New Year New Me?",
    description:
      "New year, definitely means new me? Or at least it's time to complete that one goal I set, 5 years ago. I picked up some books, figured out how I like to learn, and now, I may not be amazing at it, but it's a slow progress. Nonetheless, progress is still good.",
    date: "January 2025",
  },
  {
    title: "The Birth of TtokTtok",
    description:
      "I tried many apps or online resources, but none of them were quite right. So why not create my own little thing to help those who are trying to learn as well? Ttok Ttok - helping others learn while trying to reinfoce my own understanding.",
    date: "April 2025",
  },
  {
    title: "Continuing to grow",
    description:
      "TtokTtok is still expanding — with more features and lessons on the way! Follow along and let's learn Korean together, one bite size lesson at a time!",
    date: "Now",
  },
];

const TimelineComponent = () => {
  return (
    <section className="max-w-4xl mx-auto px-4">
      <div className="relative">
        {/* Timeline line visible only on medium and larger screens */}
        <div className="hidden md:block absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#EAD6C7] border-dashed"></div>
        {timelineData.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="mb-12 flex flex-col md:flex-row items-center gap-4 relative"
          >
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-5 h-5 bg-[#F4CBB2] border-4 border-white rounded-full z-10"></div>

            <div
              className={`w-full md:w-1/2 md:pr-6 text-center md:text-left ${
                index % 2 === 0 ? "md:order-1" : "md:order-2"
              }`}
            >
              <h3 className="text-2xl font-semibold mb-1">{item.title}</h3>
              <p className="text-md leading-relaxed">{item.description}</p>
            </div>

            <div
              className={`w-full md:w-1/2 md:pl-6 text-sm text-[#B75F45] font-semibold ${
                index % 2 === 0
                  ? "md:order-2 md:text-left text-right"
                  : "md:order-1 md:mr-10 text-right"
              }`}
            >
              {item.date}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TimelineComponent;
