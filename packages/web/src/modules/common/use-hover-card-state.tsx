import { useState } from "react";

export function useHoverCardState(onOpenChange?: (open: boolean) => void) {
  const [isCardOpen, setIsCardOpen] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsCardOpen(open);
    if (onOpenChange) {
      onOpenChange(open);
    }
  };

  const toggleOpen = () => handleOpenChange(!isCardOpen);

  return {
    isCardOpen,
    handleOpenChange,
    toggleOpen,
  };
}
