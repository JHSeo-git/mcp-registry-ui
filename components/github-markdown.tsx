import "./github-css.css";
import DOMPurify from "isomorphic-dompurify";

interface GithubMarkdownProps {
  html: string;
}

export function GithubMarkdown({ html }: GithubMarkdownProps) {
  return (
    <div className="markdown-body">
      <div
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(html, { FORBID_TAGS: ["br"] }),
        }}
      />
    </div>
  );
}
