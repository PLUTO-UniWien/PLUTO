import BlocksRenderer from "../strapi/blocks-renderer";
import type { StrapiGlossaryPage } from "./types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type GlossaryComponentProps = {
  glossary: StrapiGlossaryPage;
};

export default function GlossaryComponent({ glossary }: GlossaryComponentProps) {
  const { introduction, items } = glossary;
  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 space-y-10">
      <div className="prose prose-lg max-w-none">
        <BlocksRenderer content={introduction} />
      </div>
      <Accordion type="single" collapsible className="w-full">
        {items.map((item, index) => (
          <AccordionItem key={item.name} value={`item-${index}`}>
            <AccordionTrigger className="text-lg font-semibold">{item.name}</AccordionTrigger>
            <AccordionContent className="prose prose-sm max-w-none">
              <BlocksRenderer content={item.description} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
