import {
  BlocksRenderer as StrapiBlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";

type BlocksRendererProps = {
  content: BlocksContent;
};

export default function BlocksRenderer({ content }: BlocksRendererProps) {
  return <StrapiBlocksRenderer content={content} />;
}
