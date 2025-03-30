"use client";

import {
  BlocksRenderer as StrapiBlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";
import Link from "next/link";
import Image from "next/image";

type BlocksRendererProps = {
  content: BlocksContent;
};

export default function BlocksRenderer({ content }: BlocksRendererProps) {
  return (
    <StrapiBlocksRenderer
      content={content}
      blocks={{
        paragraph: ({ children }) => (
          <p className="text-foreground leading-7 [&:not(:first-child)]:mt-6">{children}</p>
        ),
        heading: ({ children, level }) => {
          switch (level) {
            case 1:
              return (
                <h1 className="text-4xl font-bold tracking-tight text-foreground mt-10 scroll-m-20 pb-2 first:mt-0">
                  {children}
                </h1>
              );
            case 2:
              return (
                <h2 className="text-3xl font-semibold tracking-tight text-foreground mt-10 scroll-m-20 pb-2 first:mt-0">
                  {children}
                </h2>
              );
            case 3:
              return (
                <h3 className="text-2xl font-semibold tracking-tight text-foreground mt-8 scroll-m-20">
                  {children}
                </h3>
              );
            case 4:
              return (
                <h4 className="text-xl font-semibold tracking-tight text-foreground mt-8 scroll-m-20">
                  {children}
                </h4>
              );
            case 5:
              return (
                <h5 className="text-lg font-semibold tracking-tight text-foreground mt-8 scroll-m-20">
                  {children}
                </h5>
              );
            case 6:
              return (
                <h6 className="text-base font-semibold tracking-tight text-foreground mt-8 scroll-m-20">
                  {children}
                </h6>
              );
            default:
              return (
                <h2 className="text-3xl font-semibold tracking-tight text-foreground mt-10 scroll-m-20 pb-2 first:mt-0">
                  {children}
                </h2>
              );
          }
        },
        list: ({ children, format }) => {
          if (format === "ordered") {
            return <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">{children}</ol>;
          }
          return <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>;
        },
        quote: ({ children }) => (
          <blockquote className="mt-6 border-l-2 border-border pl-6 italic text-muted-foreground">
            {children}
          </blockquote>
        ),
        code: ({ children }) => (
          <pre className="mb-4 mt-6 overflow-x-auto rounded-lg border border-border bg-secondary py-4">
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm text-secondary-foreground">
              {children}
            </code>
          </pre>
        ),
        image: ({ image }) => (
          <Image
            src={image.url}
            alt={image.alternativeText || ""}
            width={image.width}
            height={image.height}
            className="my-6 rounded-md border border-border"
          />
        ),
        link: ({ children, url }) => {
          const isRelative = url.startsWith("/");

          return isRelative ? (
            <Link
              href={url}
              className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
              prefetch
            >
              {children}
            </Link>
          ) : (
            <a
              href={url}
              className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          );
        },
      }}
      modifiers={{
        bold: ({ children }) => <strong className="font-semibold">{children}</strong>,
        italic: ({ children }) => <em className="italic">{children}</em>,
        underline: ({ children }) => (
          <span className="underline underline-offset-4">{children}</span>
        ),
        strikethrough: ({ children }) => <span className="line-through">{children}</span>,
        code: ({ children }) => (
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold text-secondary-foreground">
            {children}
          </code>
        ),
      }}
    />
  );
}
