"use client";
import Script from "next/script";
import { camelToKebab } from "@/modules/common/string-utils";

type BaseOptions = {
  id: string;
  customUrl: string;
  transparentBackground: boolean;
};

type StandardOptions = {
  type: "standard";
  width: number;
  widthType: "%" | "px";
  height: number;
  heightType: "%" | "px";
  autoResizeHeight: boolean;
};

type ModalOptions = {
  type: "modal";
  size: "small" | "medium" | "large";
  openTrigger: "click" | "load" | "delay" | "exit" | "scroll";
  openDelay: number;
  openScrollPercent: number;
  triggerBackground: string;
  triggerText: string;
  hideAfterSubmit: boolean;
  autoClose: number;
};

type PopupOptions = Omit<ModalOptions, "type"> & {
  type: "popup";
  position: "bottom-left" | "bottom-right";
  width: number;
  height: number;
};

type FullPageOptions = {
  type: "fullpage";
};

type HeyFormOptions = BaseOptions &
  Partial<StandardOptions | ModalOptions | PopupOptions | FullPageOptions>;

type HeyFormProps = {
  scriptUrl: string;
  options: HeyFormOptions;
  strategy?: "beforeInteractive" | "afterInteractive" | "lazyOnload";
  hiddenFields?: Record<string, unknown>;
};

export default function HeyFormEmbed({
  scriptUrl,
  options,
  strategy,
  hiddenFields = {},
}: HeyFormProps) {
  // transform camelCased props to `data-heyform-{kebab}` format
  const props = [...Object.entries(options), ...Object.entries(hiddenFields)].reduce(
    (acc, [key, value]) => {
      acc[`data-heyform-${camelToKebab(key)}`] = value;
      return acc;
    },
    {} as Record<string, unknown>,
  );
  const html = `<div ${Object.entries(props)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ")} />`;
  return (
    <>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Injecting HTML as string to work around HeyForm circular JSON serialization error when encountering a React-fiber-managed div element */}
      <div dangerouslySetInnerHTML={{ __html: html }} />
      <Script strategy={strategy} src={scriptUrl} />
    </>
  );
}
