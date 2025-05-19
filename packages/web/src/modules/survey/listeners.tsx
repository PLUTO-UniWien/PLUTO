/* eslint-disable @typescript-eslint/no-unused-vars */

import type { Model } from "survey-react-ui";
import type { IndexedStrapiSurvey, QuestionLabel, StrapiSurvey } from "./types";
import { adaptSurveyJsSubmissionToStrapiSubmission } from "@/modules/submission/adapter";
import { getIndexedSurvey } from "./adapter";
import { createSubmission } from "@/modules/submission/action";
import {
  trackSurveyStarted,
  trackSubmission,
  trackQuestionExplanationViewed,
  trackGlossaryItemInfoViewed,
  trackSurveyPreviewOpened,
  trackQuestionVisited,
} from "@/modules/umami/service";
import { QuestionExplanationComponent } from "@/modules/question-explanation/component";
import { GlossaryItemInfoComponent } from "@/modules/glossary-item-info/component";
import { mountReactComponent } from "@/modules/common/dom-utils";
import { useSubmissionStore } from "@/modules/submission/store";
import type { useRouter } from "next/navigation";
import type { StrapiGlossaryItem } from "../glossary/types";
import { useSurveyStore } from "./store";

type SurveyModelListenerContext = {
  strapiSurvey: StrapiSurvey;
  router: ReturnType<typeof useRouter>;
  glossaryItems: StrapiGlossaryItem[];
};

export function attachListenersToSurveyModel(model: Model, context: SurveyModelListenerContext) {
  const { strapiSurvey, router, glossaryItems } = context;
  const indexedSurvey = getIndexedSurvey(strapiSurvey);
  const questionTimeSpent = new Map<QuestionLabel, number>();
  const listenerContext: ListenerContext = {
    indexedSurvey,
    questionTimeSpent,
    router,
    glossaryItems,
  };
  const listeners = [
    restoreSurveyProgress,
    fixProgressBarAndNavButtonSync,
    persistSurveyProgress,
    trackQuestionTimeSpent,
    trackSurveyStartEvent,
    performAndTrackSurveySubmission,
    addGlossaryItemTooltipsToQuestionTitles,
    addExplanationComponentToQuestionHeader,
    moveNoneOptionToEnd,
    trackSurveyPreviewShown,
    trackQuestionVisit,
  ];

  for (const listener of listeners) {
    listener(model, listenerContext);
  }
}

type ListenerContext = {
  indexedSurvey: IndexedStrapiSurvey;
  questionTimeSpent: Map<QuestionLabel, number>;
} & Pick<SurveyModelListenerContext, "router" | "glossaryItems">;

function trackSurveyStartEvent(model: Model, _: ListenerContext) {
  model.onAfterRenderSurvey.add(async () => {
    await trackSurveyStarted();
  });
}

function performAndTrackSurveySubmission(model: Model, context: ListenerContext) {
  // Persist submission results and track it in analytics
  const { indexedSurvey, questionTimeSpent, router } = context;
  model.onComplete.add(async (survey) => {
    const submission = adaptSurveyJsSubmissionToStrapiSubmission(
      survey.data,
      indexedSurvey,
      questionTimeSpent,
    );
    const result = await createSubmission(submission);
    useSubmissionStore.getState().setSubmission({ id: result.id, ...submission });
    const submissionId = result.id;
    router.push("/result");
    await trackSubmission(submissionId);

    // Clear the survey progress after submission
    useSurveyStore.getState().setSurveyProgress(null);
  });
}

/**
 * Adds interactive tooltips to glossary terms found in survey question titles.
 *
 * This function scans survey question titles for words that match glossary item names,
 * then replaces these terms with interactive components that display definitions when
 * clicked/hovered. It handles:
 *
 * 1. Case-insensitive matching of glossary terms
 * 2. Finding whole words only (not parts of other words)
 * 3. Managing multiple occurrences of the same term
 * 4. Avoiding overlapping matches (preferring longer terms)
 * 5. Properly cleaning up React components when questions are rerendered
 *
 * The implementation uses DOM manipulation to replace text nodes with React components
 * while preserving the surrounding text content.
 *
 * @param model - The SurveyJS model instance
 * @param context - Context containing glossary items and other data
 */
function addGlossaryItemTooltipsToQuestionTitles(model: Model, context: ListenerContext) {
  const { indexedSurvey, glossaryItems } = context;
  const cleanupFunctions = new Map<string, () => void>();

  // Use a queue for deferred operations to avoid React rendering conflicts
  const pendingOperations: Array<() => void> = [];

  // Create a safe executor that schedules operations outside render cycle
  const executeSafely = (operation: () => void) => {
    // Queue the operation and schedule execution
    pendingOperations.push(operation);

    // Schedule execution of all pending operations
    if (pendingOperations.length === 1) {
      setTimeout(() => {
        // Execute all pending operations
        const ops = [...pendingOperations];
        pendingOperations.length = 0;

        for (const op of ops) {
          try {
            op();
          } catch (e) {
            console.error("Error in deferred operation:", e);
          }
        }
      }, 0);
    }
  };

  // Process and attach tooltips to each question as it's rendered
  model.onAfterRenderQuestion.add((_, { question, htmlElement }) => {
    const questionLabel = question.name as QuestionLabel;
    const strapiQuestion = indexedSurvey[questionLabel].question;

    const questionTitleElement = htmlElement.querySelector(
      ".sd-question__title span.sv-string-viewer",
    );
    if (!questionTitleElement || !questionTitleElement.textContent?.trim()) return;

    // Get the current text content
    const currentText = questionTitleElement.textContent || "";

    // Find glossary matches in the text
    const matches = findGlossaryMatches(currentText, glossaryItems);
    if (!matches.length) return;

    // Generate a unique ID for this render operation
    const renderId = `${questionLabel}-${Date.now()}`;

    // Schedule content replacement safely outside the current render cycle
    executeSafely(() => {
      // Clean up previous React components for this question first
      for (const key of Array.from(cleanupFunctions.keys())) {
        if (key.startsWith(`${questionLabel}-`) && !key.includes(renderId)) {
          const cleanup = cleanupFunctions.get(key);
          if (cleanup) {
            cleanup();
            cleanupFunctions.delete(key);
          }
        }
      }

      // Then replace text with React components
      replaceTextWithComponents(
        questionTitleElement,
        currentText,
        matches,
        questionLabel,
        strapiQuestion.id,
        renderId,
      );
    });
  });

  // Clean up when survey is disposed
  model.onDisposed?.add(() => {
    executeSafely(() => {
      for (const cleanup of cleanupFunctions.values()) {
        cleanup();
      }
      cleanupFunctions.clear();
    });
  });

  /**
   * Find all glossary item matches in the text
   */
  function findGlossaryMatches(text: string, items: StrapiGlossaryItem[]) {
    const matches: Array<{
      text: string;
      index: number;
      glossaryItem: StrapiGlossaryItem;
      id: number;
    }> = [];

    // Create normalized map of glossary items to avoid duplicates
    const normalizedItems = new Map<string, { item: StrapiGlossaryItem; id: number }>();
    for (const [i, item] of items.entries()) {
      normalizedItems.set(item.name.toLowerCase(), { item, id: i });
    }

    // Find matches for each glossary item
    for (const [normName, { item, id }] of normalizedItems.entries()) {
      // Match whole words only with word boundaries
      const regex = new RegExp(`\\b${escapeRegex(normName)}\\b`, "gi");
      let match: RegExpExecArray | null = null;

      // Find all matches
      regex.lastIndex = 0;
      match = regex.exec(text);
      while (match !== null) {
        matches.push({
          text: match[0], // Preserve original casing
          index: match.index,
          glossaryItem: item,
          id,
        });

        match = regex.exec(text);
      }
    }

    // Sort by position and handle overlapping matches (prefer longer)
    return matches
      .sort((a, b) => a.index - b.index)
      .reduce(
        (result, match) => {
          // Check if this match overlaps with the previous one
          const prev = result[result.length - 1];
          if (!prev || match.index >= prev.index + prev.text.length) {
            result.push(match);
          } else if (match.text.length > prev.text.length) {
            // If current match is longer, replace previous
            result[result.length - 1] = match;
          }
          return result;
        },
        [] as typeof matches,
      );
  }

  /**
   * Replace the original text with React components for glossary items
   */
  function replaceTextWithComponents(
    element: Element,
    text: string,
    matches: ReturnType<typeof findGlossaryMatches>,
    questionLabel: string,
    strapiQuestionId: number,
    renderId: string,
  ) {
    // Create a document fragment to build new content
    const fragment = document.createDocumentFragment();
    let lastIndex = 0;

    // Process each match
    for (const match of matches) {
      // Add text before the match
      if (match.index > lastIndex) {
        fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
      }

      // Create mount point for React component
      const mountPoint = document.createElement("span");
      mountPoint.className = "inline-block glossary-item-tooltip";
      // Include renderId in the ID to ensure uniqueness and track specific render operations
      const id = `${questionLabel}-${renderId}-${match.id}-${match.index}`;
      mountPoint.dataset.glossaryItemId = id;
      fragment.appendChild(mountPoint);

      const onGlossaryItemInfoOpenChange = (open: boolean) => {
        if (open) {
          trackGlossaryItemInfoViewed(strapiQuestionId, match.glossaryItem.name);
        }
      };

      // Mount React component
      const cleanup = mountReactComponent(
        <GlossaryItemInfoComponent
          name={match.text}
          description={match.glossaryItem.description}
          onOpenChange={onGlossaryItemInfoOpenChange}
        />,
        mountPoint,
      );

      cleanupFunctions.set(id, cleanup);
      lastIndex = match.index + match.text.length;
    }

    // Add any remaining text
    if (lastIndex < text.length) {
      fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
    }

    // Replace original content
    element.textContent = "";
    element.appendChild(fragment);
  }

  /**
   * Escape special characters in regex patterns
   */
  function escapeRegex(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}

function addExplanationComponentToQuestionHeader(model: Model, context: ListenerContext) {
  // Add explanation icon to question header
  const { indexedSurvey } = context;
  const cleanupFunctions = new Map<string, () => void>();
  const questionExplanationOpenChangeTracker = new Map<string, boolean>();
  model.onAfterRenderQuestion.add((_, { htmlElement, question }) => {
    const questionLabel = question.name as QuestionLabel;
    const strapiQuestion = indexedSurvey[questionLabel].question;
    const explanation = strapiQuestion.explanation;
    if (!explanation) return;

    const questionHeaderDiv = htmlElement.querySelector(".sd-question__header");
    if (!questionHeaderDiv) return;

    // Clean up previous mount if it exists
    const cleanup = cleanupFunctions.get(questionLabel);
    if (cleanup) {
      // Schedule cleanup for the next tick to avoid React rendering conflicts
      setTimeout(cleanup, 0);
    }

    questionHeaderDiv.classList.add("flex");

    // Whenever the explanation of a question is opened for the first time, track the event
    async function onQuestionExplanationOpenChange(open: boolean) {
      const isAlreadyTracked = questionExplanationOpenChangeTracker.get(questionLabel);
      if (open && !isAlreadyTracked) {
        await trackQuestionExplanationViewed(strapiQuestion.id, questionLabel);
        questionExplanationOpenChangeTracker.set(questionLabel, true);
      }
    }

    // Store the new cleanup function
    const newCleanup = mountReactComponent(
      <QuestionExplanationComponent
        explanation={explanation}
        onOpenChange={onQuestionExplanationOpenChange}
      />,
      questionHeaderDiv as HTMLElement,
    );
    cleanupFunctions.set(questionLabel, newCleanup);
  });
}

function moveNoneOptionToEnd(model: Model, _: ListenerContext) {
  // Move none option to the end of the list
  model.onAfterRenderQuestion.add((_, { question }) => {
    const noneOption = question.visibleChoices.find(
      (choice: { value: string }) => choice.value === "none",
    );
    if (!noneOption) return;
    const noneIndex = question.visibleChoices.indexOf(noneOption);
    question.visibleChoices.splice(noneIndex, 1);
    question.visibleChoices.push(noneOption);
  });
}

function trackQuestionTimeSpent(model: Model, context: ListenerContext) {
  const { questionTimeSpent } = context;
  const questionStartTimes = new Map<QuestionLabel, number>();

  // Track when a question is rendered
  model.onAfterRenderQuestion.add((_, { question }) => {
    const questionLabel = question.name as QuestionLabel;
    questionStartTimes.set(questionLabel, performance.now());
  });

  // Track when a question is left (either by navigation or completion)
  model.onCurrentPageChanging.add((_, { oldCurrentPage }) => {
    const questions = oldCurrentPage.elements;
    for (const question of questions) {
      const questionLabel = question.name as QuestionLabel;
      const startTime = questionStartTimes.get(questionLabel);
      if (startTime) {
        const timeSpent = performance.now() - startTime;
        const currentTimeSpent = questionTimeSpent.get(questionLabel) || 0;
        questionTimeSpent.set(questionLabel, currentTimeSpent + timeSpent);
        questionStartTimes.delete(questionLabel);
      }
    }
  });

  // When survey is completed, track all remaining question times
  model.onComplete.add((survey) => {
    if (!survey.currentPage) return;

    // Process all questions on the current page
    const currentPageQuestions = survey.currentPage.elements;
    for (const question of currentPageQuestions) {
      const questionLabel = question.name as QuestionLabel;
      const startTime = questionStartTimes.get(questionLabel);
      if (startTime) {
        const timeSpent = performance.now() - startTime;
        const currentTimeSpent = questionTimeSpent.get(questionLabel) || 0;
        questionTimeSpent.set(questionLabel, currentTimeSpent + timeSpent);
        questionStartTimes.delete(questionLabel);
      }
    }

    // Also check for any remaining questions that might not have been processed
    for (const [questionLabel, startTime] of questionStartTimes.entries()) {
      const timeSpent = performance.now() - startTime;
      const currentTimeSpent = questionTimeSpent.get(questionLabel) || 0;
      questionTimeSpent.set(questionLabel, currentTimeSpent + timeSpent);
    }

    // Clear the start times map
    questionStartTimes.clear();
  });

  // Add a fallback to ensure all question times are captured when the survey is submitted
  model.onCompleting.add((_, options) => {
    if (options.isCompleteOnTrigger) {
      // Process any remaining questions with active timers
      for (const [questionLabel, startTime] of questionStartTimes.entries()) {
        const timeSpent = performance.now() - startTime;
        const currentTimeSpent = questionTimeSpent.get(questionLabel) || 0;
        questionTimeSpent.set(questionLabel, currentTimeSpent + timeSpent);
      }
      questionStartTimes.clear();
    }
  });
}

function trackSurveyPreviewShown(model: Model, _: ListenerContext) {
  model.onShowingPreview.add(async () => {
    await trackSurveyPreviewOpened();
  });
}

function trackQuestionVisit(model: Model, context: ListenerContext) {
  const { indexedSurvey } = context;
  model.onAfterRenderPage.add(async (_, { page }) => {
    if (page.isPreviewStyle) return;
    const questionLabel = `Q${page.name.slice(1)}` as QuestionLabel;
    const strapiQuestion = indexedSurvey[questionLabel].question;
    await trackQuestionVisited(strapiQuestion.id, questionLabel);
  });
}

function persistSurveyProgress(model: Model, _: ListenerContext) {
  const persistProgress = (model: Model) => {
    const pageNumber = model.currentPageNo;
    const data = model.data;
    useSurveyStore.getState().setSurveyProgress({ pageNumber, data });
  };

  // Persist user answers
  model.onValueChanged.add((survey) => {
    persistProgress(survey);
  });

  // Persist current page
  // Not using `onCurrentPageChanged` on purpose as it is not triggered when navigating via the nav dots
  model.onAfterRenderPage.add((survey, options) => {
    persistProgress(survey);
  });
}

function restoreSurveyProgress(model: Model, _: ListenerContext) {
  // Accessing the state outside of the callback on purpose to use the progress which was persisted before the survey was rendered again
  const surveyProgress = useSurveyStore.getState().surveyProgress;

  model.onAfterRenderSurvey.add(() => {
    if (surveyProgress === null) return;

    const { pageNumber, data } = surveyProgress;
    // Restore the answers
    model.data = data;

    // Restore the page where the user left off
    const answeredQuestionLabels = Object.keys(data) as QuestionLabel[];
    if (answeredQuestionLabels.length === 0) {
      return;
    }

    // Since SurveyJS maintains some non-serializable state in the model object we first must step through all the answered pages,
    // then navigate back to the page where the user left off (it's possible that the user answered 12 questions but left the survey on page 4)
    const lastAnsweredQuestionLabel = answeredQuestionLabels[answeredQuestionLabels.length - 1];
    const lastAnsweredQuestionIndex = +lastAnsweredQuestionLabel.slice(1);

    for (let i = 0; i < lastAnsweredQuestionIndex; i++) model.nextPage();
    while (model.currentPageNo > pageNumber) model.prevPage();
  });
}

// Patch for SurveyJS to fix a bug in navigation behavior when using both progress bar dots and nav buttons
// The bug occurs due to SurveyJS's internal state tracking becoming desynchronized:
// - When a user has completed multiple pages (e.g. pages 1-12 out of 25)
// - Then jumps to an earlier page using the progress bar dots (e.g. page 3)
// - The "Previous" navigation button will incorrectly navigate to the last completed page (page 11)
// - Instead of the expected previous page (page 2)
// This patch ensures the internal state stays synchronized by updating the currentSingleElement
// to match the actual current page after any page render
function fixProgressBarAndNavButtonSync(model: Model, _: ListenerContext) {
  model.onAfterRenderPage.add((survey, { page }) => {
    // @ts-expect-error SurveyJS does not expose the `getSingleElements` method
    const singleElements = survey.getSingleElements() as (typeof survey.currentSingleElement)[];
    const pageIndex = page.num - 1;
    survey.currentSingleElement = singleElements[pageIndex];
  });
}
