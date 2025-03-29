import BlocksRenderer from "@/modules/strapi/blocks-renderer";
import type { StrapiWeightingOverviewPage } from "./types";

type WeightingOverviewComponentProps = {
  weightingOverview: StrapiWeightingOverviewPage;
};

export default function WeightingOverviewComponent({
  weightingOverview,
}: WeightingOverviewComponentProps) {
  const { content } = weightingOverview;
  return (
    <div className="container mx-auto py-4 space-y-8">
      <div className="prose prose-lg max-w-none">
        <BlocksRenderer content={content} />
      </div>
    </div>
  );
}
