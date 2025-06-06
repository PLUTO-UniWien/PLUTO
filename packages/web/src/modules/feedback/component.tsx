import BlocksRenderer from "@/modules/strapi/blocks-renderer";
import type { StrapiFeedbackPage } from "./types";

type FeedbackComponentProps = {
  feedback: StrapiFeedbackPage;
};

export default function FeedbackComponent({ feedback }: FeedbackComponentProps) {
  const { content } = feedback;
  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-10">
      <div className="prose prose-lg max-w-none">
        <BlocksRenderer content={content} />
      </div>
    </div>
  );
}
