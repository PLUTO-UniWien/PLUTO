import { StrapiResponseSingle } from '@pluto/survey-model';

export type AppendixWeightingViewProps = {
  title: string;
  introduction: string;
};

export type AppendixWeightingViewData =
  StrapiResponseSingle<AppendixWeightingViewProps>;
