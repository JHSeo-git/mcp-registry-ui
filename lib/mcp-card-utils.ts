import title from "title";

export const getServerTitle = (text: string) => {
  const safeTitle = text.split("/")?.[1];

  if (!safeTitle) {
    return text;
  }

  return title(safeTitle.replaceAll(/[-_]/g, " "), { special: ["MCP"] });
};

export const getServerOwner = (text: string) => {
  const safeFirstPart = text.split("/")?.[0];

  if (!safeFirstPart) {
    return text;
  }

  const safeOwner = safeFirstPart.split(".")?.at(-1);

  if (!safeOwner) {
    return safeFirstPart;
  }

  return safeOwner;
};
