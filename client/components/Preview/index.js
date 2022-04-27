import React, { useMemo } from "react";
import { marked } from "marked";

export default function Preview({ content }) {
  const contentHTML = useMemo(() => {
    return content ? marked.parse(content) : "";
  }, [content]);
  return <div dangerouslySetInnerHTML={{ __html: contentHTML }}></div>;
}
