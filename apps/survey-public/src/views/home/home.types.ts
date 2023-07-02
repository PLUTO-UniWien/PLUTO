import { StrapiResponseSingle } from '@pluto/survey-model';

export type HomeProps = {
  content: string;
  contributorsInfo: string;
  launchButtonText: string;
};

export type HomeData = StrapiResponseSingle<HomeProps>;
