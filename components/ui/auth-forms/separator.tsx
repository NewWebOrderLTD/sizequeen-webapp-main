interface SeparatorProps {
  text: string;
}

export default function Separator({ text }: SeparatorProps) {
  return (
    <div className="relative w-full mx-auto">
      <div className="relative flex items-center gap-3 my-5">
        <div className="border-t flex-1 border-fg-line"></div>
        <span className="text-xs uppercase text-fg-solid px-2 whitespace-nowrap">
          {text}
        </span>
        <div className="border-t flex-1 border-fg-line"></div>
      </div>
    </div>
  );
}
