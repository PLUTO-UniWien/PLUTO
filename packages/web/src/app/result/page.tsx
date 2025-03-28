"use client";

import QuadrantPlot from "@/modules/quadrant-plot/component";
import { analyzeSubmission } from "@/modules/result/analysis";
import { useSubmissionStore } from "@/modules/submission/store";
import { useSurveyStore } from "@/modules/survey/store";

export default function Page() {
  const submission = useSubmissionStore((state) => state.submission);
  const survey = useSurveyStore((state) => state.survey);

  if (submission === null || survey === null) {
    return <div>Loading...</div>;
  }

  const analysis = analyzeSubmission(submission, survey);
  const { feedback, score, scoreNormalized, counts } = analysis;

  return (
    <div>
      <QuadrantPlot
        xLowerBound={-1}
        xUpperBound={1}
        yLowerBound={-1}
        yUpperBound={1}
        pointCoordinate={[0.1, 0.1]}
        quadrantLabels={["High benefit", "High risk", "Low risk", "Low benefit"]}
        scoreLabels={{ x: "Risk", y: "Benefit" }}
      />
      <h1>Feedback</h1>
      <div>{JSON.stringify(feedback, null, 2)}</div>
      <h1>Score</h1>
      <div>{JSON.stringify(score, null, 2)}</div>
      <h1>Score Normalized</h1>
      <div>{JSON.stringify(scoreNormalized, null, 2)}</div>
      <h1>Counts</h1>
      <div>{JSON.stringify(counts, null, 2)}</div>
    </div>
  );
}
