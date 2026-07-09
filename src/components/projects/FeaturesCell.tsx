interface Props {
  items: string[];
}

export default function FeaturesCell({ items }: Props) {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 hover:border-zinc-700 transition-colors"
        >
          <span className="w-5 h-5 rounded bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-[10px] font-bold mt-0.5 shrink-0">
            ✦
          </span>
          <span className="text-zinc-300 text-sm leading-relaxed">{item}</span>
        </div>
      ))}
    </div>
  );
}
