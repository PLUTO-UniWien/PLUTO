import BlocksRenderer from "@/modules/strapi/blocks-renderer";
import type { StrapiImprintPage } from "./types";

type ImprintComponentProps = {
  imprint: StrapiImprintPage;
};

export default function ImprintComponent({ imprint }: ImprintComponentProps) {
  const { content } = imprint;
  return (
    <div className="container mx-auto py-4 space-y-8">
      <div className="prose prose-lg max-w-none">
        <BlocksRenderer content={content} />
      </div>
    </div>
  );
}
