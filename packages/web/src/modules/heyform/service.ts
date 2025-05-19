import type { HeyFormInstance } from "./types";

export function getHeyFormInstance(): HeyFormInstance {
  "use client";

  if (!window.HeyForm) {
    console.warn("HeyForm is not initialized");

    const dummyInstance: HeyFormInstance = {
      openModal: () => {},
      closeModal: () => {},
      toggleModal: () => {},
      openPopup: () => {},
      closePopup: () => {},
      togglePopup: () => {},
    };

    return dummyInstance;
  }

  return window.HeyForm;
}
