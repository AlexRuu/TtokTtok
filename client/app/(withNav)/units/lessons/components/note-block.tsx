interface NoteBlockProps {
  content: string;
  style?: "default" | "highlight" | "warning" | "tip";
}

const styleMap = {
  default: "bg-[#FFF4E6] border-[#E6C3A0]",
  highlight: "bg-[#FFF7D6] border-[#FFD700]",
  warning: "bg-[#FFF0F0] border-[#FF6B6B]",
  tip: "bg-[#EAFBF0] border-[#70D6A8]",
};

const NoteBlock = ({ content, style = "default" }: NoteBlockProps) => {
  const styleClass = styleMap[style] ?? styleMap.default;

  return (
    <div className={`border-l-4 px-4 py-3 my-4 rounded-r-md ${styleClass}`}>
      <p className="text-sm text-[#5A4231]">{content}</p>
    </div>
  );
};

export default NoteBlock;
