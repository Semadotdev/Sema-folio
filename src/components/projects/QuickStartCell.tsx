import { inline as mdInline } from "@/components/Md";

interface Props {
  steps: string[];
}

export default function QuickStartCell({ steps }: Props) {
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {steps.map((step, i) => (
        <div
          key={i}
          className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 hover:border-zinc-700 transition-colors"
        >
          <span className="text-indigo-400 text-lg font-bold mr-2">{i + 1}.</span>
          <span className="text-zinc-300 text-sm" dangerouslySetInnerHTML={{ __html: mdInline(step) }} />
        </div>
      ))}
    </div>
  );
}
