type LexicalNode = {
  text?: string;
  children?: LexicalNode[];
};

type LexicalRoot = {
  root?: {
    children?: LexicalNode[];
  };
};

export function serializeLexical(richText: unknown): string {
  const doc = richText as LexicalRoot | null | undefined;
  if (!doc?.root?.children?.length) return "";

  return doc.root.children
    .map((node) => {
      if (node.children?.length) {
        return node.children.map((child) => child.text ?? "").join("");
      }
      return node.text ?? "";
    })
    .filter(Boolean)
    .join("\n\n");
}
