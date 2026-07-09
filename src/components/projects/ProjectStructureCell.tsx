interface Props {
  tree: string;
}

export default function ProjectStructureCell({ tree }: Props) {
  return (
    <pre className="text-zinc-400 text-sm font-mono leading-relaxed overflow-x-auto">
      {tree}
    </pre>
  );
}
