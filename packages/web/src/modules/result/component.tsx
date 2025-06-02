"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { FileDown, MessageCircleQuestion } from "lucide-react";
import type { BlocksContent } from "@strapi/blocks-react-renderer";

import QuadrantPlot from "@/modules/quadrant-plot/component";
import BlocksRenderer from "@/modules/strapi/blocks-renderer";
import LoadingComponent from "@/modules/loading/component";
import HeyFormEmbed from "@/modules/heyform/component";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

import type { AnalysisResult } from "@/modules/result/analysis";
import type { StrapiResultPage } from "@/modules/result/types";
import type { StrapiSubmission } from "@/modules/submission/types";
import type { StrapiSurvey } from "@/modules/survey/types";

import { analyzeSubmission } from "@/modules/result/analysis";
import { useSubmissionStore } from "@/modules/submission/store";
import { useSurveyStore } from "@/modules/survey/store";
import usePdfExport from "@/modules/result/use-pdf-export";
import { env } from "@/env";
import { getHeyFormInstance } from "@/modules/heyform/service";
import { trackFeedbackFormOpened } from "@/modules/analytics/umami/service";
import { useHoverCardState } from "@/modules/common/use-hover-card-state";

// Define a threshold for showing the disclaimer
const UNANSWERED_THRESHOLD = 10;

// Result type descriptions for hover tooltips
const RESULT_TYPE_DESCRIPTIONS = {
  A: "Likely creates significant public value as it will plausibly yield significant benefits without posing unacceptably high risks. These types should be supported.",
  B: "Unlikely to yield significant public benefits, but also poses minimal risks. Financial profits from Type B uses should be partially returned to the public domain.",
  C: "Produces significant public benefits, but poses unacceptably high risks. Type C uses are only permissible if risks can be reduced to acceptable levels.",
  D: "Likely does not create significant public value while at the same time posing unacceptably high risks. These activities should be banned.",
} as const;

type ResultComponentProps = {
  resultPage: StrapiResultPage;
};

export default function ResultComponent({
  resultPage: { displayFeedbackForm, resultsReadyTitle, explanation },
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
  const unansweredQuestionCount = counts.excluded.risk + counts.excluded.benefit;

  // Log PDF export event to analytics and perform the export
  const handleExportPdf = () => {
    exportToPdf(submission.id);
  };

  return (
    <div className="container mx-auto max-w-5xl px-2 sm:px-3 md:px-4 space-y-3 sm:space-y-4 mb-8 relative">
      {/* Content to be captured when exporting to PDF */}
      <div
        ref={contentRef}
        className="flex flex-col gap-2 sm:gap-3 md:gap-4 bg-primary-foreground py-2 sm:py-3 px-2 sm:px-3 rounded-lg"
      >
        {/* Page Header with title and logo */}
        <div className="flex flex-row items-start justify-between mb-1 sm:mb-2 gap-3">
          <div className="flex flex-col max-w-[70%]">
            <h1 className="text-xl font-bold mb-0">{resultsReadyTitle}</h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Survey submitted on {formatDate(submission.submittedAt)}
            </p>
          </div>
          <div className="flex-shrink-0 w-16 sm:w-20 md:w-24 h-auto">
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

        {/* Prominent Disclaimer for many unanswered questions */}
        {unansweredQuestionCount >= UNANSWERED_THRESHOLD && (
          <div
            className="bg-yellow-100/15 border-l-4 border-yellow-500 p-4 rounded-md mb-3 sm:mb-4"
            role="alert"
          >
            <h2 className="font-bold text-lg mb-1">Important: Limited Results Accuracy</h2>
            <p className="text-sm text-justify">
              You have marked {unansweredQuestionCount} questions as &quot;I don&apos;t know&quot;.
              When {UNANSWERED_THRESHOLD} or more questions are unanswered, the reliability of your
              results may be compromised. We recommend completing the survey again with more
              complete responses for a more accurate assessment.
            </p>
          </div>
        )}

        {/* Integrated Results Card */}
        <div className="bg-card rounded-lg p-3 sm:p-4 md:p-6 border">
          <IntegratedResultsSection
            risk={scoreNormalized.risk}
            benefit={scoreNormalized.benefit}
            resultType={resultType}
          />

          {/* Secondary Metrics Section */}
          <div className="mt-6 sm:mt-8 border-t pt-4 sm:pt-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-3">
              <div className="flex flex-col">
                <h3 className="text-xs sm:text-sm font-medium mb-1 text-center">
                  You have answered
                </h3>
                <div className="text-center">
                  <p className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold mb-0">
                    {answeredQuestionCount}{" "}
                    <span className="text-xs sm:text-sm md:text-base font-normal">
                      of {allQuestionCount}
                    </span>
                  </p>
                  <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 md:mt-1">
                    questions
                  </p>
                </div>
              </div>

              <div className="flex flex-col">
                <h3 className="text-xs sm:text-sm font-medium mb-1 text-center">
                  Questions by Impact
                </h3>
                <div className="flex justify-center gap-5 sm:gap-8 md:gap-12">
                  <div className="text-center">
                    <p className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold mb-0">
                      {counts.included.risk}
                    </p>
                    <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 md:mt-1">
                      risk
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-bold mb-0">
                      {counts.included.benefit}
                    </p>
                    <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 md:mt-1">
                      benefit
                    </p>
                  </div>
                </div>
              </div>
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
        <h2 className="text-2xl font-semibold mb-3 text-center">How to Interpret Your Results</h2>
        <div className="prose prose-sm max-w-none">
          <BlocksRenderer content={explanation} />
        </div>
      </div>

      {/* Floating Export Button */}
      <div className="fixed bottom-20 right-8 z-10">
        <Button
          variant="default"
          onClick={handleExportPdf}
          disabled={isExporting}
          className="shadow-lg hover:shadow-xl rounded-full flex items-center justify-center gap-2 w-auto h-12 px-4 py-3 ring-2 ring-primary/20 ring-offset-2 hover:ring-primary/50"
          aria-label="Export PDF"
        >
          <span className="w-6 h-6 flex items-center justify-center">
            {isExporting ? (
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-t-transparent border-solid" />
            ) : (
              <FileDown strokeWidth={2} className="h-6 w-6" />
            )}
          </span>
          <span className="font-medium">Export PDF</span>
        </Button>
      </div>

      {/* Floating Feedback Button */}
      {displayFeedbackForm && (
        <div className="fixed bottom-8 right-8 z-10">
          <FeedbackForm submissionId={submission.id} />
        </div>
      )}
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

// New integrated results section that combines quadrant plot with metrics
type IntegratedResultsSectionProps = {
  risk: number;
  benefit: number;
  resultType: AnalysisResult["resultType"];
};

function IntegratedResultsSection({ risk, benefit, resultType }: IntegratedResultsSectionProps) {
  // Calculate position percentage for slider (convert from -1...1 to 0%...100%)
  const clamp = (v: number) => Math.min(100, Math.max(0, v));
  const riskPosition = clamp(((risk + 1) / 2) * 100);
  const benefitPosition = clamp(((benefit + 1) / 2) * 100);

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
      {/* Large screens: First column - Result Type */}
      <div className="hidden lg:flex lg:flex-none lg:w-48 flex-col">
        <div className="text-center w-full">
          <h3 className="text-lg font-medium mb-2 sm:mb-3">Result Type</h3>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-md font-medium mb-4">{resultType.label}</p>
          <ResultTypeScale currentType={resultType.id} />
          <div className="mt-2 flex justify-between text-[10px] sm:text-xs text-muted-foreground w-full">
            <span>Preferred</span>
            <span>Discouraged</span>
          </div>
        </div>
      </div>

      {/* Always: Quadrant Plot (centered) */}
      <div className="flex-1 flex flex-col items-center">
        <h3 className="text-lg font-medium mb-2 sm:mb-3 text-center">Risk-Benefit Assessment</h3>
        <div className="w-full max-w-[240px] sm:max-w-[280px] lg:max-w-[320px] aspect-square mx-auto">
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

      {/* Large screens: Third column - Score */}
      <div className="hidden lg:flex lg:flex-none lg:w-48 flex-col">
        <div className="text-center w-full">
          <h3 className="text-lg font-medium mb-2 sm:mb-3">Score</h3>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <div className="flex flex-col gap-4 sm:gap-6">
            <ScoreDisplay
              label="Risk"
              score={risk}
              position={riskPosition}
              gradientColors="bg-gradient-to-r from-[#d9edd6] via-[#faf1d3] to-[#f2cfcc]"
              lowLabel="Low Risk"
              highLabel="High Risk"
              lowColor="text-[#4e9c59]"
              highColor="text-[#d55c55]"
            />

            <ScoreDisplay
              label="Benefit"
              score={benefit}
              position={benefitPosition}
              gradientColors="bg-gradient-to-r from-[#f2cfcc] via-[#faf1d3] to-[#d9edd6]"
              lowLabel="Low Benefit"
              highLabel="High Benefit"
              lowColor="text-[#d55c55]"
              highColor="text-[#4e9c59]"
            />
          </div>
        </div>
      </div>

      {/* Small/Medium screens: Two columns below plot */}
      <div className="flex-1 flex-col justify-center mt-2 lg:hidden">
        {/* Headers - responsive layout */}
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-3 sm:gap-6 mb-3 sm:mb-6">
          <div className="text-center">
            <h3 className="text-sm sm:text-base font-medium mb-2 sm:mb-3">Result Type</h3>
          </div>
          <div className="text-center min-[480px]:block hidden">
            <h3 className="text-sm sm:text-base font-medium mb-2 sm:mb-3">Score</h3>
          </div>
        </div>

        {/* Content - stack vertically on very small screens */}
        <div className="flex flex-col min-[480px]:grid min-[480px]:grid-cols-2 gap-4 sm:gap-6">
          {/* Result Type Section */}
          <div className="flex flex-col items-center justify-center min-[480px]:border-r min-[480px]:pr-3 sm:pr-6">
            <div className="text-center w-full">
              <p className="text-xs sm:text-sm font-medium mb-2 sm:mb-4">{resultType.label}</p>
              <ResultTypeScale currentType={resultType.id} />
              <div className="mt-2 flex justify-between text-[9px] min-[480px]:text-[10px] sm:text-xs text-muted-foreground">
                <span>Preferred</span>
                <span>Discouraged</span>
              </div>
            </div>
          </div>

          {/* Score Section */}
          <div className="flex flex-col">
            {/* Show header on small screens when stacked */}
            <div className="text-center min-[480px]:hidden mb-3">
              <h3 className="text-sm font-medium">Score</h3>
            </div>
            <div className="flex flex-col gap-4 sm:gap-6">
              <ScoreDisplay
                label="Risk"
                score={risk}
                position={riskPosition}
                gradientColors="bg-gradient-to-r from-[#d9edd6] via-[#faf1d3] to-[#f2cfcc]"
                lowLabel="Low Risk"
                highLabel="High Risk"
                lowColor="text-[#4e9c59]"
                highColor="text-[#d55c55]"
              />

              <ScoreDisplay
                label="Benefit"
                score={benefit}
                position={benefitPosition}
                gradientColors="bg-gradient-to-r from-[#f2cfcc] via-[#faf1d3] to-[#d9edd6]"
                lowLabel="Low Benefit"
                highLabel="High Benefit"
                lowColor="text-[#d55c55]"
                highColor="text-[#4e9c59]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type ResultTypeScaleProps = {
  currentType: string;
};

function ResultTypeScale({ currentType }: ResultTypeScaleProps) {
  const types = ["A", "B", "C", "D"] as const;

  return (
    <div className="flex flex-col items-center">
      {/* Type items */}
      <div className="flex justify-center gap-1.5 sm:gap-2 md:gap-3 mb-1.5 sm:mb-2">
        {types.map((type) => (
          <ResultTypeItem
            key={type}
            type={type}
            isActive={type === currentType}
            description={RESULT_TYPE_DESCRIPTIONS[type]}
          />
        ))}
      </div>
    </div>
  );
}

type ResultTypeItemProps = {
  type: string;
  isActive: boolean;
  description: string;
};

function ResultTypeItem({ type, isActive, description }: ResultTypeItemProps) {
  const { isCardOpen, handleOpenChange, toggleOpen } = useHoverCardState();

  return (
    <HoverCard openDelay={50} open={isCardOpen} onOpenChange={handleOpenChange}>
      <HoverCardTrigger asChild onClick={toggleOpen}>
        <div
          className={`
            w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-10 lg:h-10
            rounded-lg flex items-center justify-center cursor-help transition-all duration-200
            ${isActive ? "bg-[#3586cf] text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}
          `}
        >
          <span className="text-sm sm:text-base md:text-lg lg:text-base font-bold">{type}</span>
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        className="w-full sm:w-[400px] md:w-[500px] max-w-[85vw] p-4 shadow-lg"
        side="bottom"
        align="center"
      >
        <div className="space-y-2">
          <h4 className="font-bold text-sm">Type {type}</h4>
          <p className="text-sm text-muted-foreground leading-relaxed text-justify">
            {description}
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

type ScoreDisplayProps = {
  label: string;
  score: number;
  position: number;
  gradientColors: string;
  lowLabel: string;
  highLabel: string;
  lowColor: string;
  highColor: string;
};

function ScoreDisplay({
  label,
  score,
  position,
  gradientColors,
  lowLabel,
  highLabel,
  lowColor,
  highColor,
}: ScoreDisplayProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <p className="text-xs sm:text-sm font-medium">{label}</p>
        <p className="text-xs sm:text-sm font-semibold">{score.toFixed(2)}</p>
      </div>
      <div className="relative mb-1">
        <div className={`h-2 sm:h-2 w-full ${gradientColors} rounded-full`} />
        <div
          className="absolute top-0 w-3 sm:w-3 h-3 sm:h-3 bg-[#3586cf] rounded-full -mt-0.5 shadow-sm"
          style={{ left: `calc(${position}% - 6px)` }}
        />
      </div>
      <div className="flex justify-between items-start w-full text-[9px] min-[480px]:text-[10px] sm:text-[10px] mt-1">
        <div className="text-left">
          <div className={`${lowColor} font-medium`}>-1.0</div>
          <div className={`${lowColor} font-medium mt-0.5 leading-tight`}>{lowLabel}</div>
        </div>
        <div className="text-right">
          <div className={`${highColor} font-medium`}>1.0</div>
          <div className={`${highColor} font-medium mt-0.5 leading-tight`}>{highLabel}</div>
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
    <div className="bg-card rounded-lg p-2.5 sm:p-3 md:p-4 border">
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
      <h3 className="text-sm sm:text-base md:text-lg font-semibold mb-1.5 sm:mb-2 md:mb-3">
        {title}
      </h3>
      <ul className="space-y-1.5 sm:space-y-2 list-disc pl-4 sm:pl-5 text-sm sm:text-base">
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
      toast.warning(
        <span className="text-[16px]">
          Please take the survey before accessing the results. Results will be accessible here once
          you have taken the survey.
        </span>,
      );
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

type FeedbackFormProps = {
  submissionId: number;
};

function FeedbackForm({ submissionId }: FeedbackFormProps) {
  const id = env.NEXT_PUBLIC_HEYFORM_FORM_ID;
  const customUrl = `${env.NEXT_PUBLIC_HEYFORM_CUSTOM_URL}`;
  const scriptUrl = env.NEXT_PUBLIC_HEYFORM_SCRIPT_URL;

  if (!id || !customUrl || !scriptUrl) {
    return null;
  }

  const handleOpenFeedbackForm = async () => {
    const heyForm = getHeyFormInstance();
    heyForm.openModal(id);
    await trackFeedbackFormOpened(submissionId);
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={handleOpenFeedbackForm}
        className="shadow-lg hover:shadow-xl rounded-full flex items-center justify-center gap-2 w-auto h-12 px-4 py-3 ring-2 ring-primary/20 ring-offset-2 hover:ring-primary/50"
        aria-label="Provide Feedback"
      >
        <span className="w-6 h-6 flex items-center justify-center">
          <MessageCircleQuestion strokeWidth={2} className="h-6 w-6" />
        </span>
        <span className="font-medium">Provide Feedback</span>
      </Button>
      <HeyFormEmbed
        strategy="afterInteractive"
        scriptUrl={scriptUrl}
        hiddenFields={{ submissionId }}
        options={{
          id,
          customUrl,
          transparentBackground: false,
          type: "modal",
          openTrigger: "click",
          size: "medium",
        }}
      />
    </>
  );
}
