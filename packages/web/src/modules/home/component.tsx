import BlocksRenderer from "@/modules/strapi/blocks-renderer";
import type { StrapiHomePage } from "./types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

type HomeComponentProps = {
  homePage: StrapiHomePage;
};

export default function HomeComponent({ homePage }: HomeComponentProps) {
  const { content, contributorsInfo } = homePage;
  return (
    <div className="container mx-auto py-4 space-y-8">
      <div className="prose prose-lg max-w-none">
        <BlocksRenderer content={content} />
      </div>

      <div className="py-2 flex justify-center">
        <Button
          asChild
          size="lg"
          className="text-lg px-8 py-6 rounded-md shadow-md transition-all hover:shadow-lg"
        >
          <Link href="/survey" prefetch>
            Start Survey <CheckCircle className="ml-2" />
          </Link>
        </Button>
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="prose prose-sm max-w-none text-gray-600">
          <BlocksRenderer content={contributorsInfo} />
        </div>
      </div>
    </div>
  );
}
