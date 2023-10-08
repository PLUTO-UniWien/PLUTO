import { StrapiResponseSingle } from '@pluto/survey-model';

export type WeightingHistoryViewProps = {
  title: string;
  introduction: string;
};

export type WeightingHistoryViewData =
  StrapiResponseSingle<WeightingHistoryViewProps>;
