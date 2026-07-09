interface Props {
  headers: string[];
  rows: string[][];
}

export default function TechStackCell({ headers, rows }: Props) {
  return (
    <div className="space-y-3">
      {rows.map((row, i) => (
        <div
          key={i}
          className="flex items-center justify-between gap-4 p-3 rounded-xl bg-zinc-800/30 border border-zinc-800 hover:border-zinc-700 transition-colors"
        >
          <span className="text-blue-400 text-xs font-mono tracking-wider uppercase font-semibold min-w-[80px]">
            {row[0] ?? ""}
          </span>
          <span className="text-zinc-300 text-sm text-right">
            {row[1] ?? ""}
          </span>
        </div>
      ))}
    </div>
  );
}
