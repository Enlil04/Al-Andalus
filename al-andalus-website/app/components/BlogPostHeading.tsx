"use client";

import AnimatedHeadline from "./AnimatedHeadline";

type BlogPostHeadingProps = {
  level: number;
  text: string;
};

export default function BlogPostHeading({ level, text }: BlogPostHeadingProps) {
  const tag = Math.min(Math.max(level, 2), 6) as 2 | 3 | 4 | 5 | 6;

  return (
    <AnimatedHeadline
      title={text}
      as={tag === 2 ? "h2" : tag === 3 ? "h3" : tag === 4 ? "h4" : tag === 5 ? "h5" : "h6"}
      className="blog-post__heading"
    />
  );
}
