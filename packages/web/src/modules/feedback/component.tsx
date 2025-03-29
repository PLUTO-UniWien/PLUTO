import BlocksRenderer from "@/modules/strapi/blocks-renderer";
import type { StrapiFeedbackPage } from "./types";

type FeedbackComponentProps = {
  feedback: StrapiFeedbackPage;
};

export default function FeedbackComponent({ feedback }: FeedbackComponentProps) {
  const { content } = feedback;
  return (
    <div className="container mx-auto py-4 space-y-8">
      <div className="prose prose-lg max-w-none">
        <BlocksRenderer content={content} />
      </div>
    </div>
  );
}
