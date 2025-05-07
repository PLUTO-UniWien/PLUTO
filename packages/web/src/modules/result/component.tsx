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
import Image from "next/image";
import { toast } from "sonner";
type ResultComponentProps = {
  resultPage: StrapiResultPage;
};

export default function ResultComponent({
  resultPage: { resultsReadyTitle, explanation },
}: ResultComponentProps) {
  // Access the submission and survey from the store which were set after a valid survey submission was made
  const submission = useSubmissionStore((state) => state.submission);
  const survey = useSurveyStore((state) => state.survey);

  // Get loading state and analysis result, with automatic redirection if needed
  const { isLoading, analysisResult } = useAnalysisResult(submission, survey);
  const { contentRef, isExporting, exportToPdf } = usePdfExport({ minDuration: 1000 });

  // If loading or analysis failed, show loading component
  if (isLoading || analysisResult === null || submission === null || survey === null) {
    return <LoadingComponent />;
  }

  // At this point, we know submission and survey are not null so we can proceed with the analysis and rendering
  const { resultType, feedback, scoreNormalized, counts } = analysisResult;

  // Compute counts for metrics section
  const allQuestionCount = counts.total.risk + counts.total.benefit;
  const answeredQuestionCount = counts.included.risk + counts.included.benefit;

  // Log PDF export event to analytics and perform the export
  const handleExportPdf = () => {
    exportToPdf(submission.id);
  };

  return (
    <div className="container mx-auto max-w-5xl px-3 sm:px-4 space-y-3 sm:space-y-4 mb-8 relative">
      {/* Content to be captured when exporting to PDF */}
      <div
        ref={contentRef}
        className="flex flex-col gap-3 sm:gap-4 bg-primary-foreground py-3 px-3 rounded-lg"
      >
        {/* Page Header with title and logo */}
        <div className="flex flex-row items-center justify-between mb-1 sm:mb-2 gap-3">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold mb-0">{resultsReadyTitle}</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Survey submitted on {formatDate(submission.submittedAt)}
            </p>
          </div>
          <div className="flex-shrink-0 w-20 sm:w-24 md:w-32 h-auto">
            <Image
              src="/logo-pluto.png"
              alt="PLUTO Logo"
              width={128}
              height={128}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>

        {/* Main Results Card - Grid layout for iPad */}
        <div className="bg-card rounded-lg p-3 border">
          <div className="lg:grid lg:grid-cols-5 gap-3 items-center">
            {/* Quadrant Plot - Take 3 columns on large screens */}
            <div className="lg:col-span-3 flex justify-center items-center">
              <QuadrantPlotSection risk={scoreNormalized.risk} benefit={scoreNormalized.benefit} />
            </div>

            {/* Metrics Section - Take 2 columns on large screens */}
            <div className="lg:col-span-2 space-y-3 mt-3 lg:mt-0">
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
      <div className="mt-3 border-t pt-3 px-2">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 text-center">
          How to Interpret Your Results
        </h2>
        <div className="prose prose-sm max-w-none">
          <BlocksRenderer content={explanation} />
        </div>
      </div>

      {/* Floating Export Button */}
      <div className="fixed bottom-8 right-8 z-10">
        <Button
          variant="default"
          onClick={handleExportPdf}
          disabled={isExporting}
          className="shadow-lg hover:shadow-xl rounded-full flex items-center justify-center w-14 h-14 p-0"
          aria-label="Export PDF"
        >
          {isExporting ? (
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-t-transparent border-solid" />
          ) : (
            <FileDown strokeWidth={2.5} className="h-12 w-12" />
          )}
        </Button>
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
      <div className="w-full max-w-[180px] sm:max-w-[220px] md:max-w-[260px] lg:max-w-[300px] aspect-square">
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
    <div className="grid grid-cols-2 gap-3">
      {/* Score Card */}
      <div className="flex flex-col">
        <h3 className="text-sm sm:text-base font-medium mb-1 text-center">Score</h3>
        <div className="flex justify-center gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center">
              <p className="text-lg sm:text-xl md:text-2xl font-bold">{risk.toFixed(2)}</p>
            </div>
            <p className="text-xs text-muted-foreground">risk</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center">
              <p className="text-lg sm:text-xl md:text-2xl font-bold">{benefit.toFixed(2)}</p>
            </div>
            <p className="text-xs text-muted-foreground">benefit</p>
          </div>
        </div>
      </div>

      {/* Result Type Card */}
      <div className="flex flex-col">
        <h3 className="text-sm sm:text-base font-medium mb-1 text-center">Result Type</h3>
        <div className="text-center">
          <p className="text-lg sm:text-xl md:text-2xl font-bold">{resultType.id}</p>
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
    <div className="grid grid-cols-2 gap-3">
      {/* Questions answered */}
      <div className="flex flex-col">
        <h3 className="text-sm sm:text-base font-medium mb-1 text-center">You have answered</h3>
        <div className="text-center">
          <p className="text-lg sm:text-xl md:text-2xl font-bold">
            {answeredQuestionCount}{" "}
            <span className="text-sm font-normal">of {allQuestionCount}</span>
          </p>
          <p className="text-xs text-muted-foreground">questions</p>
        </div>
      </div>

      {/* Answers affect */}
      <div className="flex flex-col">
        <h3 className="text-sm sm:text-base font-medium mb-1 text-center">Questions by Impact</h3>
        <div className="flex justify-center gap-4">
          <div className="text-center">
            <p className="text-lg sm:text-xl md:text-2xl font-bold">{riskCount}</p>
            <p className="text-xs text-muted-foreground">risk</p>
          </div>
          <div className="text-center">
            <p className="text-lg sm:text-xl md:text-2xl font-bold">{benefitCount}</p>
            <p className="text-xs text-muted-foreground">benefit</p>
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
    <div className="bg-card rounded-lg p-3 sm:p-4 border">
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
      <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">{title}</h3>
      <ul className="space-y-2 list-disc pl-5">
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
 * Hook to handle initial loading state, validation, and analysis generation
 * Redirects to survey page if data is missing or analysis fails
 */
function useAnalysisResult(
  submission: StrapiSubmission | null,
  survey: StrapiSurvey | null,
  redirectPath = "/survey",
) {
  const [isLoading, setIsLoading] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const router = useRouter();

  useEffect(() => {
    const redirect = () => {
      toast.warning("Please take the survey before accessing the results.");
      router.replace(redirectPath);
    };

    // Allow a brief delay for the store to initialize
    const timer = setTimeout(() => {
      // If submission or survey is null, redirect
      if (submission === null || survey === null) {
        setIsLoading(false);
        redirect();

        return;
      }

      try {
        // Perform the analysis
        const result = analyzeSubmission(submission, survey);
        setAnalysisResult(result);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to analyze submission:", error);
        setIsLoading(false);
        // Clear submission and survey data from store as they might be corrupt
        useSubmissionStore.getState().setSubmission(null);
        useSurveyStore.getState().setSurvey(null);
        // Redirect to survey page
        redirect();
        router.replace(redirectPath);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [submission, survey, router, redirectPath]);

  return {
    isLoading,
    analysisResult,
  };
}
