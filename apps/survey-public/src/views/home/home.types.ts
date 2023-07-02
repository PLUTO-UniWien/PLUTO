import { StrapiResponseSingle } from '@pluto/survey-model';

export type HomeViewProps = {
  content: string;
  contributorsInfo: string;
  launchButtonText: string;
};

export type HomeViewData = StrapiResponseSingle<HomeViewProps>;
