import type { BlocksContent } from "@strapi/blocks-react-renderer";
import BlocksRenderer from "@/modules/strapi/blocks-renderer";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useState } from "react";

type GlossaryItemInfoComponentProps = {
  name: string;
  description: BlocksContent;
  onOpenChange?: (open: boolean) => void;
};

export function GlossaryItemInfoComponent({
  name,
  description,
  onOpenChange,
}: GlossaryItemInfoComponentProps) {
  const [isCardOpen, setIsCardOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsCardOpen(open);
    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  return (
    <HoverCard openDelay={150} open={isCardOpen} onOpenChange={handleOpenChange}>
      <HoverCardTrigger asChild onClick={() => handleOpenChange(!isCardOpen)}>
        <span className="underline cursor-help">{name}</span>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-full sm:w-[450px] md:w-[550px] lg:w-[650px] max-w-[75vw] p-4 shadow-lg"
        side="top"
        align="center"
      >
        <div className="space-y-2 max-h-[60vh] overflow-y-auto">
          <BlocksRenderer content={description} />
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
