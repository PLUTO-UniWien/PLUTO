declare global {
  interface Window {
    HeyForm: HeyFormInstance;
  }
}

export type HeyFormInstance = {
  openModal: (formId: string) => void;
  closeModal: (formId: string) => void;
  toggleModal: (formId: string) => void;
  openPopup: (formId: string) => void;
  closePopup: (formId: string) => void;
  togglePopup: (formId: string) => void;
};
