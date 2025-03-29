"use client";
import QuadrantPlot from "@/modules/quadrant-plot/component";
import type { AnalysisResult } from "./analysis";
import BlocksRenderer from "../strapi/blocks-renderer";
import type { BlocksContent } from "@strapi/blocks-react-renderer";
import { analyzeSubmission } from "@/modules/result/analysis";
import { useSubmissionStore } from "@/modules/submission/store";
import { useSurveyStore } from "@/modules/survey/store";
import type { StrapiResultPage } from "./types";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import LoadingComponent from "../loading/component";

type ResultComponentProps = {
  resultPage: StrapiResultPage;
};

export default function ResultComponent({
  resultPage: { resultsReadyTitle, explanation },
}: ResultComponentProps) {
  const submission = useSubmissionStore((state) => state.submission);
  const survey = useSurveyStore((state) => state.survey);

  if (submission === null || survey === null) {
    return <LoadingComponent />;
  }

  const analysisResult = analyzeSubmission(submission, survey);
  const { analyzedAt, resultType, feedback, scoreNormalized, counts } = analysisResult;

  const allQuestionCount = counts.total.risk + counts.total.benefit;
  const answeredQuestionCount = counts.included.risk + counts.included.benefit;

  return (
    <div className="container mx-auto max-w-4xl px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
      <PageHeader title={resultsReadyTitle} analyzedAt={analyzedAt} />

      {/* Main Results Card */}
      <div className="bg-card rounded-xl p-4 sm:p-5 md:p-6 shadow-sm border">
        <div className="flex flex-col gap-4 sm:gap-6 md:gap-8">
          <QuadrantPlotSection risk={scoreNormalized.risk} benefit={scoreNormalized.benefit} />
          <PrimaryMetricsSection
            risk={scoreNormalized.risk}
            benefit={scoreNormalized.benefit}
            resultType={resultType}
          />
          <SecondaryMetricsSection
            answeredQuestionCount={answeredQuestionCount}
            allQuestionCount={allQuestionCount}
            riskCount={counts.included.risk}
            benefitCount={counts.included.benefit}
          />
        </div>
      </div>

      {/* Feedback Section */}
      {feedback.benefit.length > 0 && (
        <FeedbackCard
          title="The benefits of the data use would be higher..."
          blocksValue={feedback.benefit}
        />
      )}

      {feedback.risk.length > 0 && (
        <FeedbackCard
          title="The risks of the data use would be lower..."
          blocksValue={feedback.risk}
        />
      )}

      {/* Explanation Section */}
      <div className="mt-8 sm:mt-10 md:mt-12 border-t pt-6 sm:pt-8 px-2">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-center">
          How to Interpret Your Results
        </h2>
        <div className="prose prose-sm sm:prose max-w-none">
          <BlocksRenderer content={explanation} />
        </div>
      </div>
    </div>
  );
}

type PageHeaderProps = {
  title: string;
  analyzedAt: string;
};

function PageHeader({ title, analyzedAt }: PageHeaderProps) {
  const formattedDate = new Date(analyzedAt).toLocaleString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 sm:mb-4 gap-2 sm:gap-3">
      <div className="flex flex-col">
        <h1 className="text-xl sm:text-2xl font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground">Analyzed on {formattedDate}</p>
      </div>
      <Button className="self-start w-auto">
        <Download className="mr-2" /> Export
      </Button>
    </div>
  );
}

type QuadrantPlotSectionProps = {
  risk: number;
  benefit: number;
};

function QuadrantPlotSection({ risk, benefit }: QuadrantPlotSectionProps) {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="w-full max-w-[240px] sm:max-w-[320px] md:max-w-[400px] aspect-square">
        <QuadrantPlot
          xLowerBound={-1}
          xUpperBound={1}
          yLowerBound={-1}
          yUpperBound={1}
          pointCoordinate={[risk, benefit]}
          quadrantLabels={["High benefit", "High risk", "Low risk", "Low benefit"]}
          scoreLabels={{ x: "Risk", y: "Benefit" }}
        />
      </div>
    </div>
  );
}

type PrimaryMetricsSectionProps = {
  risk: number;
  benefit: number;
  resultType: AnalysisResult["resultType"];
};

function PrimaryMetricsSection({ risk, benefit, resultType }: PrimaryMetricsSectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto w-full">
      {/* Score Card */}
      <div className="flex flex-col">
        <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3 text-center">Score</h3>
        <div className="flex justify-center gap-8 sm:gap-12 md:gap-16">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1">{risk.toFixed(2)}</p>
              <span className="text-red-500 text-sm">↓</span>
            </div>
            <p className="text-xs text-muted-foreground">risk (lower is better)</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1">
                {benefit.toFixed(2)}
              </p>
              <span className="text-green-500 text-sm">↑</span>
            </div>
            <p className="text-xs text-muted-foreground">benefit (higher is better)</p>
          </div>
        </div>
      </div>

      {/* Result Type Card */}
      <div className="flex flex-col mt-3 sm:mt-0">
        <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3 text-center">Result Type</h3>
        <div className="text-center">
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1">{resultType.id}</p>
          <p className="text-xs text-muted-foreground">{resultType.label}</p>
        </div>
      </div>
    </div>
  );
}

type SecondaryMetricsSectionProps = {
  answeredQuestionCount: number;
  allQuestionCount: number;
  riskCount: number;
  benefitCount: number;
};

function SecondaryMetricsSection({
  answeredQuestionCount,
  allQuestionCount,
  riskCount,
  benefitCount,
}: SecondaryMetricsSectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto w-full pt-0">
      {/* Questions answered */}
      <div className="flex flex-col">
        <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3 text-center">
          You have answered
        </h3>
        <div className="text-center">
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1">
            {answeredQuestionCount}{" "}
            <span className="text-lg sm:text-xl font-normal">of {allQuestionCount}</span>
          </p>
          <p className="text-xs text-muted-foreground">questions</p>
        </div>
      </div>

      {/* Answers affect */}
      <div className="flex flex-col mt-3 sm:mt-0">
        <h3 className="text-base sm:text-lg font-medium mb-2 sm:mb-3 text-center">
          Questions by Impact
        </h3>
        <div className="flex justify-center gap-8 sm:gap-12 md:gap-16">
          <div className="text-center">
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1">{riskCount}</p>
            <p className="text-xs text-muted-foreground">risk-related questions</p>
          </div>
          <div className="text-center">
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1">{benefitCount}</p>
            <p className="text-xs text-muted-foreground">benefit-related questions</p>
          </div>
        </div>
      </div>
    </div>
  );
}

type FeedbackCardProps = {
  title: string;
  blocksValue: BlocksContent[];
};

function FeedbackCard({ title, blocksValue }: FeedbackCardProps) {
  return (
    <div className="bg-card rounded-xl p-5 sm:p-6 md:p-8 shadow-sm border">
      <FeedbackList title={title} blocksValue={blocksValue} />
    </div>
  );
}

type FeedbackListProps = {
  title: string;
  blocksValue: BlocksContent[];
};

function FeedbackList({ title, blocksValue }: FeedbackListProps) {
  return (
    <>
      <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 sm:mb-4 md:mb-5">{title}</h3>
      <ul className="space-y-2 sm:space-y-3 md:space-y-4 list-disc pl-5 sm:pl-6 md:pl-8">
        {blocksValue.map((blocks, index) => (
          <li
            key={`feedback-${title.toLowerCase().replace(/ /g, "-")}-${index}`}
            className="text-foreground"
          >
            <BlocksRenderer content={blocks} />
          </li>
        ))}
      </ul>
    </>
  );
}
