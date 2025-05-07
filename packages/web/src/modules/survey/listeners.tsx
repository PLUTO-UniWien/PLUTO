/* eslint-disable @typescript-eslint/no-unused-vars */

import type { Model } from "survey-react-ui";
import type { IndexedStrapiSurvey, QuestionLabel, StrapiSurvey } from "./types";
import { adaptSurveyJsSubmissioToStrapiSubmission } from "@/modules/submission/adapter";
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
  router: ReturnType<typeof useRouter>;
  glossaryItems: StrapiGlossaryItem[];
};

function trackSurveyStartEvent(model: Model, _: ListenerContext) {
  let firstPageVisited = false;
  model.onAfterRenderPage.add(async (survey) => {
    const isFirstPage = survey.currentPageNo === 0;
    if (isFirstPage && !firstPageVisited) {
      firstPageVisited = true;
      await trackSurveyStarted();
    }
  });
}

function performAndTrackSurveySubmission(model: Model, context: ListenerContext) {
  // Persist submission results and track it in analytics
  const { indexedSurvey, questionTimeSpent, router } = context;
  model.onComplete.add(async (survey) => {
    const submission = adaptSurveyJsSubmissioToStrapiSubmission(
      survey.data,
      indexedSurvey,
      questionTimeSpent,
    );
    useSubmissionStore.getState().setSubmission(submission);
    const result = await createSubmission(submission);
    const submissionId = result.id;
    router.push("/result");
    await trackSubmission(submissionId);
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

  // Process and attach tooltips to each question as it's rendered
  model.onAfterRenderQuestion.add((_, { question, htmlElement }) => {
    const questionLabel = question.name as QuestionLabel;
    const strapiQuestion = indexedSurvey[questionLabel].question;
    const questionTitleElement = htmlElement.querySelector(
      ".sd-question__title span.sv-string-viewer",
    );

    if (!questionTitleElement || !questionTitleElement.textContent?.trim()) return;

    // Clean up previous React components for this question
    const keysToClean = Object.keys(cleanupFunctions).filter((key) =>
      key.startsWith(`${questionLabel}-`),
    );
    for (const key of keysToClean) {
      cleanupFunctions.get(key)?.();
      cleanupFunctions.delete(key);
    }

    // Get the original text content
    const originalText = questionTitleElement.textContent || "";

    // Find glossary matches in the text
    const matches = findGlossaryMatches(originalText, glossaryItems);
    if (!matches.length) return;

    // Replace text with React components
    replaceTextWithComponents(
      questionTitleElement,
      originalText,
      matches,
      questionLabel,
      strapiQuestion.id,
    );
  });

  // Clean up when survey is disposed
  model.onDisposed?.add(() => {
    for (const cleanup of cleanupFunctions.values()) {
      cleanup();
    }
    cleanupFunctions.clear();
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
      const id = `${questionLabel}-${match.id}-${match.index}`;
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
  model.onCurrentPageChanged.add(async (_, { newCurrentPage }) => {
    const questionLabel = newCurrentPage.name.replace("P", "Q") as QuestionLabel;
    const strapiQuestion = indexedSurvey[questionLabel].question;
    await trackQuestionVisited(strapiQuestion.id, questionLabel);
  });
}
