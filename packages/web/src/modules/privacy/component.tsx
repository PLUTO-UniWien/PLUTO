import BlocksRenderer from "@/modules/strapi/blocks-renderer";
import type { StrapiPrivacyPage } from "./types";

type PrivacyComponentProps = {
  privacy: StrapiPrivacyPage;
};

export default function PrivacyComponent({ privacy }: PrivacyComponentProps) {
  const { content } = privacy;
  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-10">
      <div className="prose prose-lg max-w-none">
        <BlocksRenderer content={content} />
      </div>
    </div>
  );
}
