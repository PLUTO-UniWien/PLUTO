import BlocksRenderer from "@/modules/strapi/blocks-renderer";
import type { StrapiPrivacyPage } from "./types";

type PrivacyComponentProps = {
  privacy: StrapiPrivacyPage;
};

export default function PrivacyComponent({ privacy }: PrivacyComponentProps) {
  const { content } = privacy;
  return (
    <div className="container mx-auto py-4 space-y-8">
      <div className="prose prose-lg max-w-none">
        <BlocksRenderer content={content} />
      </div>
    </div>
  );
}
