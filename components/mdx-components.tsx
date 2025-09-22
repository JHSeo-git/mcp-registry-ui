import { MDXRemote, type MDXRemoteOptions } from "next-mdx-remote-client/rsc";

import "./github-css.css";

export const mdxComponents = {};

interface MdxProps {
  source: string;
}
export function Mdx({ source }: MdxProps) {
  const options: MDXRemoteOptions = {
    mdxOptions: {
      remarkPlugins: [
        // ...
      ],
    },
    parseFrontmatter: true,
    scope: {},
    vfileDataIntoScope: "toc", // <---------
  };
  return (
    <div className="markdown-body">
      <MDXRemote
        source={source}
        components={mdxComponents}
        onError={(error) => <div>{JSON.stringify(error, null, 2)}</div>}
        options={options}
      />
    </div>
  );
}
