import BlocksRenderer from "@/modules/strapi/blocks-renderer";
import type { StrapiHomePage } from "./types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type HomeComponentProps = {
  homePage: StrapiHomePage;
};

export default function HomeComponent({ homePage }: HomeComponentProps) {
  const { content, contributorsInfo } = homePage;
  return (
    <div>
      <BlocksRenderer content={content} />
      <Button asChild>
        <Link href="/survey" prefetch>
          Start Survey
        </Link>
      </Button>

      <BlocksRenderer content={contributorsInfo} />
    </div>
  );
}
