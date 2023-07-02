import { StrapiResponseSingle } from '@pluto/survey-model';

export type ResultViewProps = {
  resultsReadyLabel: string;
  explanation: string;
  feedback: string;
};

export type ResultViewData = StrapiResponseSingle<ResultViewProps>;
