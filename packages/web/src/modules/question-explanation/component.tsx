import type { BlocksContent } from "@strapi/blocks-react-renderer";
import BlocksRenderer from "@/modules/strapi/blocks-renderer";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";
import { useHoverCardState } from "@/modules/common/use-hover-card-state";

type QuestionExplanationComponentProps = {
  explanation: BlocksContent;
  onOpenChange?: (open: boolean) => void;
};

export function QuestionExplanationComponent({
  explanation,
  onOpenChange,
}: QuestionExplanationComponentProps) {
  const { isCardOpen, handleOpenChange, toggleOpen } = useHoverCardState(onOpenChange);

  return (
    <HoverCard openDelay={50} open={isCardOpen} onOpenChange={handleOpenChange}>
      <HoverCardTrigger asChild onClick={toggleOpen}>
        <Button variant="ghost" size="icon" className="rounded-full" asChild>
          <HelpCircle className="text-primary w-6 h-6 ml-4" />
        </Button>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-full sm:w-[450px] md:w-[550px] lg:w-[650px] max-w-[75vw] p-4 shadow-lg"
        side="top"
        align="center"
      >
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          <BlocksRenderer content={explanation} />
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
