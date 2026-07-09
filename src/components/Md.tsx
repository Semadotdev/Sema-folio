import { marked } from "marked";

export function inline(content: string): string {
  return marked.parseInline(content, { async: false }) as string;
}

export function block(content: string): string {
  return marked.parse(content, { async: false }) as string;
}
