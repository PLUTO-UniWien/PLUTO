import BlocksRenderer from "@/modules/strapi/blocks-renderer";
import type { StrapiImprintPage } from "./types";

type ImprintComponentProps = {
  imprint: StrapiImprintPage;
};

export default function ImprintComponent({ imprint }: ImprintComponentProps) {
  const { content } = imprint;
  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-10">
      <div className="prose prose-lg max-w-none">
        <BlocksRenderer content={content} />
      </div>
    </div>
  );
}
