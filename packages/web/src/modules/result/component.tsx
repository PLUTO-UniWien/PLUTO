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
import { FileDown } from "lucide-react";
import LoadingComponent from "../loading/component";
import usePdfExport from "./use-pdf-export";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { StrapiSubmission } from "@/modules/submission/types";
import type { StrapiSurvey } from "@/modules/survey/types";

type ResultComponentProps = {
  resultPage: StrapiResultPage;
};

export default function ResultComponent({
  resultPage: { resultsReadyTitle, explanation },
}: ResultComponentProps) {
  // Access the submission and survey from the store which were set after a valid survey submission was made
  const submission = useSubmissionStore((state) => state.submission);
  const survey = useSurveyStore((state) => state.survey);

  // State validation to ensure there has been at least one prior survey submission before trying to render results
  const { isLoading, isStateValid } = useStateValidation(submission, survey, "/survey");
  const { contentRef, isExporting, exportToPdf } = usePdfExport({ minDuration: 1000 });

  // During initial loading, show loading component
  if (isLoading) {
    return <LoadingComponent />;
  }

  // If still null after loading period, also show loading while redirecting
  if (!isStateValid || submission === null || survey === null) {
    return <LoadingComponent />;
  }

  // At this point, we know submission and survey are not null so we can proceed with the analysis and rendering
  const analysisResult = analyzeSubmission(submission, survey);
  const { analyzedAt, resultType, feedback, scoreNormalized, counts } = analysisResult;

  // Compute counts for metrics section
  const allQuestionCount = counts.total.risk + counts.total.benefit;
  const answeredQuestionCount = counts.included.risk + counts.included.benefit;

  // Log PDF export event to analytics and perform the export
  const handleExportPdf = () => {
    exportToPdf(submission.id);
  };

  return (
    <div className="container mx-auto max-w-4xl space-y-4 sm:space-y-6">
      {/* Header with export button only */}
      <div className="flex flex-row justify-end items-center mb-3 sm:mb-4">
        <Button
          variant="default"
          size="sm"
          onClick={handleExportPdf}
          disabled={isExporting}
          className="cursor-pointer"
        >
          <FileDown className="mr-2 h-4 w-4" />
          {isExporting ? "Exporting..." : "Export PDF"}
        </Button>
      </div>

      {/* Content to be captured when exporting to PDF */}
      <div
        ref={contentRef}
        className="flex flex-col gap-4 sm:gap-6 md:gap-8 bg-primary-foreground py-6 sm:py-8"
      >
        {/* Page Header with title and logo */}
        <div className="flex flex-row items-center justify-between mb-2 sm:mb-3 gap-4">
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl font-bold mb-1">{resultsReadyTitle}</h1>
            <p className="text-sm text-muted-foreground">Analyzed on {formatDate(analyzedAt)}</p>
          </div>
          <img src="/logo-pluto.png" alt="PLUTO Logo" className="w-32 sm:w-44" />
        </div>

        {/* Main Results Card */}
        <div className="bg-card rounded-xl p-4 sm:p-5 md:p-6 border">
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

        {/* Feedback Sections */}
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
      </div>

      {/* Explanation Section - Not included in the screenshot */}
      <div className="mt-6 sm:mt-8 border-t pt-6 sm:pt-8 px-2">
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

// Helper function to format date consistently
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
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
            </div>
            <p className="text-xs text-muted-foreground">risk (lower is better)</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1">
                {benefit.toFixed(2)}
              </p>
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
    <div className="bg-card rounded-xl p-5 sm:p-6 md:p-8 border">
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

/**
 * Hook to handle initial loading state and navigation
 * when required store data is missing
 */
function useStateValidation(
  submission: StrapiSubmission | null,
  survey: StrapiSurvey | null,
  redirectPath: string,
) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Allow a brief delay for the store to initialize
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Only redirect after the loading time if still null
      if (submission === null || survey === null) {
        router.replace(redirectPath);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [submission, survey, router, redirectPath]);

  return {
    isLoading,
    isStateValid: submission !== null && survey !== null,
  };
}
