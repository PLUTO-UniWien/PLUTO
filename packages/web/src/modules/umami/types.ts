declare global {
  interface Window {
    umami: UmamiInstance;
  }
}

export type UmamiInstance = {
  track: (event: string, data: Record<string, unknown>) => Promise<void>;
  identify: (data: Record<string, unknown>) => Promise<void>;
};
