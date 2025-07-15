import Image from "next/image";

interface ImageBlockProps {
  url: string;
  alt?: string;
}

const ImageBlock = ({ url, alt }: ImageBlockProps) => {
  return (
    <div className="my-6 w-full">
      <Image
        src={url}
        alt={alt ?? "Lesson image"}
        width={800}
        height={500}
        className="rounded-lg shadow-md mx-auto"
      />
      {alt && <p className="text-center text-sm text-[#9C7B64] mt-2">{alt}</p>}
    </div>
  );
};

export default ImageBlock;
