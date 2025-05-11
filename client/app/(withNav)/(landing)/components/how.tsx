import { BarChart2, BookOpen, Pencil } from "lucide-react";
import React from "react";

const HowItWorks = () => {
  return (
    <section className="py-20 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {[
        {
          icon: <BookOpen className="mx-auto mb-4 w-10 h-10 text-[#B75F45]" />,
          title: "Learn",
          desc: "Explore easy-to-understand lessons on grammar, particles, and more.",
          bg: "#FFF1EA",
        },
        {
          icon: <Pencil className="mx-auto mb-4 w-10 h-10 text-[#B75F45]" />,
          title: "Practice",
          desc: "Reinforce what you've learned with quick quizzes and interactive questions.",
          bg: "#FFEEE4",
        },
        {
          icon: <BarChart2 className="mx-auto mb-4 w-10 h-10 text-[#B75F45]" />,
          title: "Track",
          desc: "Sign up when you're ready to start tracking your progress and revisiting lessons.",
          bg: "#FFF6EF",
        },
      ].map((card, index) => (
        <div
          key={index}
          className="p-6 rounded-2xl shadow-md text-center transition-transform hover:scale-[1.02] hover:shadow-lg"
          style={{ backgroundColor: card.bg }}
        >
          {card.icon}
          <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
          <p>{card.desc}</p>
        </div>
      ))}
    </section>
  );
};

export default HowItWorks;
