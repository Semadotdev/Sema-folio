export default function ProjectStructureCell({ tree }: { tree: string }) {
  return (
    <pre className="text-zinc-400 text-sm font-mono leading-relaxed overflow-x-auto">
      {tree}
    </pre>
  );
}
