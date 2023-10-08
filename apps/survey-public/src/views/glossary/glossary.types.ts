import { StrapiResponseSingle } from '@pluto/survey-model';

export type GlossaryViewProps = {
  introduction: string;
  glossaryItems: GlossaryItem[];
};

export type GlossaryItem = {
  name: string;
  description: string;
};

export type GlossaryViewData = StrapiResponseSingle<GlossaryViewProps>;
