import BlocksRenderer from "../strapi/blocks-renderer";
import type { StrapiPost, StrapiPostPreview } from "./types";
import Link from "next/link";
import { CalendarIcon } from "lucide-react";

type PostPreviewListProps = {
  postPreviews: StrapiPostPreview[];
};

export function PostPreviewList({ postPreviews }: PostPreviewListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {postPreviews.map(({ createdAt, title, slug }) => (
        <PostPreview key={slug} postPreview={{ createdAt, title, slug }} />
      ))}
    </div>
  );
}

type PostPreviewProps = {
  postPreview: StrapiPostPreview;
};

export function PostPreview({ postPreview }: PostPreviewProps) {
  const { title, slug, createdAt } = postPreview;
  return (
    <Link href={`/news/${slug}`}>
      <div className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 h-full">
        <h2 className="text-xl font-semibold mb-2 line-clamp-2">{title}</h2>
        <p className="text-sm text-gray-500 flex items-center">
          <CalendarIcon className="w-4 h-4 mr-1" />
          {new Date(createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </Link>
  );
}

type PostComponentProps = {
  post: StrapiPost;
};

export function PostComponent({ post }: PostComponentProps) {
  const { createdAt, title, body } = post;
  return (
    <article className="container mx-auto py-4 space-y-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mt-10 scroll-m-20 pb-2 first:mt-0">
          {title}
        </h1>
        <p className="text-gray-500 flex items-center">
          {createdAt && (
            <>
              <CalendarIcon className="w-4 h-4 mr-1" />
              {new Date(createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </>
          )}
        </p>
      </div>
      <div className="prose prose-lg max-w-none">
        <BlocksRenderer content={body} />
      </div>
    </article>
  );
}
