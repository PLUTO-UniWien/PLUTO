import BlocksRenderer from "@/modules/strapi/blocks-renderer";
import type { StrapiWeightingHistoryPage } from "./types";

type WeightingHistoryComponentProps = {
  weightingHistory: StrapiWeightingHistoryPage;
};

export default function WeightingHistoryComponent({
  weightingHistory,
}: WeightingHistoryComponentProps) {
  const { content } = weightingHistory;
  return (
    <div className="container mx-auto py-4 space-y-8">
      <div className="prose prose-lg max-w-none">
        <BlocksRenderer content={content} />
      </div>
    </div>
  );
}
