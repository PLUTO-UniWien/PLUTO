import type { APIResponseData } from "@/modules/strapi/types";
import { strapiPublicUrl } from "@/modules/strapi/utils";
import type {
  AnswerChoice,
  AnswerChoiceLabel,
  IndexedStrapiSurvey,
  Question,
  QuestionLabel,
  StrapiSurvey,
} from "./types";

/**
 * Generates an object suitable for use with SurveyJS.
 *
 * @param {StrapiSurvey} survey - Our internal representation of a survey.
 */
export function adaptStrapiSurveyToSurveyJsModelJSON(survey: StrapiSurvey) {
  const coreProperties = createCoreProperties(survey);
  const questionsWithPageTitle = prepareQuestionsWithPageTitles(survey);
  const pages = questionsWithPageTitle.map(createPage).slice(0, 3);

  return { ...coreProperties, pages };
}

/**
 * Creates an indexed representation of a survey for easier access to questions and choices.
 *
 * The returned object maps question labels (e.g., "Q1") to an object containing:
 * - The question object
 * - A record of answer choices indexed by their labels (e.g., "A1.1")
 *
 * This makes it easier to look up questions and choices by their labels when processing
 * survey submissions.
 *
 * @param {StrapiSurvey} survey - The survey to index
 * @returns {IndexedStrapiSurvey} - The indexed survey
 */
export function getIndexedSurvey(survey: StrapiSurvey) {
  const indexedSurvey: IndexedStrapiSurvey = {};

  let questionNumber = 1;
  for (const group of survey.groups) {
    for (const question of group.questions || []) {
      const indexedChoices: Record<AnswerChoiceLabel, AnswerChoice> = {};

      // Index all answer choices for this question
      let choiceNumber = 1;
      for (const choice of question.choices || []) {
        const choiceLabel = answerChoiceLabel(questionNumber, choiceNumber);
        indexedChoices[choiceLabel] = choice as AnswerChoice;
        choiceNumber++;
      }

      // Add the question and its indexed choices to the survey index
      const qLabel = questionLabel(questionNumber);
      indexedSurvey[qLabel] = {
        question,
        indexedChoices,
      };

      questionNumber++;
    }
  }

  return indexedSurvey;
}

/**
 * Creates the core properties object for the SurveyJS model.
 *
 * @param {StrapiSurvey} survey - The survey to generate core properties for.
 */
function createCoreProperties(survey: StrapiSurvey) {
  return {
    title: survey.title,
    showPageTitles: false,
    showProgressBar: "top",
    questionsOnPageMode: "questionPerPage",
    showPreviewBeforeComplete: "showAllQuestions",
    widthMode: "responsive",
    logo: getLogoUrl(survey),
    logoPosition: "top",
    logoWidth: 120,
    logoHeight: 120,
    logoFit: "contain",
    completedHtml: " ",
  };
}

/**
 * Prepares questions with their page titles and numbers.
 *
 * @param {StrapiSurvey} survey - The survey containing the questions.
 */
function prepareQuestionsWithPageTitles(survey: StrapiSurvey) {
  const questionsWithPageTitle = [];
  let questionNumber = 1;

  for (const group of survey.groups) {
    for (const question of group.questions || []) {
      questionsWithPageTitle.push({
        ...question,
        number: questionNumber,
        pageTitle: group.title,
      });
      questionNumber++;
    }
  }

  return questionsWithPageTitle;
}

/**
 * Creates a page object for a question.
 *
 * @param {Question & { number: number; pageTitle: string }} question - The question with its metadata.
 */
function createPage(question: Question & { number: number; pageTitle: string }) {
  const questionNumber = question.number;
  const name = pageLabel(questionNumber);
  const elements = [mapQuestion(question, questionNumber)];
  const { name: questionLabel } = elements[0];
  const title = `${question.pageTitle} - ${questionLabel}`;

  return { name, title, elements };
}

function getLogoUrl(survey: StrapiSurvey) {
  const logo = survey.logo as unknown as APIResponseData<"plugin::upload.file">["data"];
  // @ts-expect-error the auto-generated strapi types are too loose, it is safe to assume that the logo has various formats
  return strapiPublicUrl(logo.formats?.small?.url || logo.url);
}

/**
 * Label generator for a survey page.
 *
 * @param {number} pageNumber - The page number to generate a label for.
 */
function pageLabel(pageNumber: number) {
  return `P${pageNumber}`;
}

/**
 * Label generator for an answer choice.
 *
 * @param {number} questionNumber - The question number to generate a label for.
 * @param {number} choiceNumber - The choice number to generate a label for.
 */
function answerChoiceLabel(questionNumber: number, choiceNumber: number): AnswerChoiceLabel {
  return `A${questionNumber}.${choiceNumber}`;
}

/**
 * Generates an object from a {@link AnswerChoice} appearing in the {@link Question}
 * identified by `questionNumber` at the `choiceNumber`th position, to be used with SurveyJS.
 *
 * @param {AnswerChoice} choice - The answer choice object to map.
 * @param {number} questionNumber - The question number of the question containing the answer choice.
 * @param {number} choiceNumber - The position where the answer choice appears in the question.
 */
function mapAnswerChoice(choice: AnswerChoice, questionNumber: number, choiceNumber: number) {
  return {
    value: answerChoiceLabel(questionNumber, choiceNumber),
    text: choice.body,
  };
}

/**
 * Label generator for a question.
 *
 * @param {number} questionNumber - The question number to generate a label for.
 */
function questionLabel(questionNumber: number): QuestionLabel {
  return `Q${questionNumber}`;
}

/**
 * Generates an object from a {@link Question} to be used with SurveyJS.
 *
 * @param {Question} question - The question object to map.
 * @param {number} questionNumber - The position where the question appears in the survey.
 */
function mapQuestion(question: Question, questionNumber: number) {
  const type = getQuestionType(question);
  const name = questionLabel(questionNumber);
  const title = `${question.body} (${getTickHint(question)})`;
  const isRequired = true;
  const validators = getQuestionValidators(question, questionNumber);
  const choices = question.choices
    .filter((choice) => choice.type === "regular")
    .map((choice, choiceNumber) =>
      mapAnswerChoice(choice as AnswerChoice, questionNumber, choiceNumber + 1),
    );
  const separateSpecialChoices = false;
  const hasOther = getQuestionHasOther(question);
  const otherText = hasOther && getQuestionOtherText(question);
  const hasNone = getQuestionHasNone(question);
  const noneText = hasNone && getQuestionNoneText(question);
  const maxSelectedChoices = type === "checkbox" && getQuestionMaxSelectedChoices(question);
  const description = "";
  return {
    type,
    name,
    description,
    title,
    isRequired,
    choices,
    separateSpecialChoices,
    ...((!!validators && { validators }) || undefined),
    ...((hasOther && { hasOther, otherText }) || undefined),
    ...((hasNone && { hasNone, noneText }) || undefined),
    ...((maxSelectedChoices && { maxSelectedChoices }) || undefined),
  };
}

/**
 * Logic for determining the hint about how many answer choices to tick.
 * The returned value will be used to suffix the question body.
 * E.g. " Which of the answers below best describe the data user? (tick one)".
 *
 * We already store the selection range in the metadata of the question,
 * therefore it is not necessary to store the tick hint in the question's body,
 * as it can be inferred from the selection range. This function defines the inference logic.
 *
 * @param {Question} question - The question to get the hint for.
 */
function getTickHint(question: Question) {
  const { selectionMin, selectionMax } = question.metadata;
  const numChoices = question.choices.length;
  if (selectionMin === 1 && selectionMax === 1) {
    return "tick one";
  }

  if (!selectionMax || selectionMax === numChoices) {
    return "tick as many as necessary";
  }

  return `tick up to ${numberToWord(selectionMax || numChoices)}`;
}

/**
 * Naive implementation of a number to word converter.
 * Works up to 10.
 *
 * @param {number} number - The number to convert to a word.
 */
function numberToWord(number: number) {
  if (number < 0 || number > 10) {
    throw new Error(`Unsupported number ${number}`);
  }
  const words = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
  ];
  return words[number];
}

/**
 * Determines the renderer to use for a question based on the selection range.
 * Currently, we expect all questions to be of type 'radiogroup' or 'checkbox'.
 *
 * @param {Question} question - The question to get the renderer for.
 */
function getQuestionType(question: Question) {
  const { selectionMin, selectionMax } = question.metadata;
  if (selectionMin === 1 && selectionMax === 1) {
    return "radiogroup";
  }
  return "checkbox";
}

/**
 * Determines whether the supplied question should have the role "other" in the SurveyJS form.
 *
 * @param {Question} question - The question to check.
 */
function getQuestionHasOther(question: Question) {
  return question.choices.some(
    (choice) => choice.type === "other" || choice.type === "none of the above",
  );
}

/**
 * Extracts the answer choice text for the "other" choice of the supplied question.
 *
 * @param {Question} question - The question to get the "other" choice text for.
 */
function getQuestionOtherText(question: Question) {
  const choice = question.choices.find(
    (choice) => choice.type === "other" || choice.type === "none of the above",
  );
  if (choice) {
    return choice.body;
  }
  throw new Error("Question does not have an other choice");
}

/**
 * Determines whether the supplied question should have the role "none" in the SurveyJS form.
 *
 * @param {Question} question - The question to check.
 */
function getQuestionHasNone(question: Question) {
  return question.choices.some((choice) => choice.type === "no answer");
}

/**
 * Extracts the answer choice text for the "none" choice of the supplied question.
 *
 * @param {Question} question - The question to get the "none" choice text for.
 */
function getQuestionNoneText(question: Question) {
  const choice = question.choices.find((choice) => choice.type === "no answer");
  if (choice) {
    return choice.body;
  }
  throw new Error("Question does not have a none choice");
}

/**
 * Returns `question.metadata.selectionMax` of the supplied question or the number of choices if max is not set explicitly.
 *
 * @param {Question} question - The question to get the maximum number of selected choices for.
 */
function getQuestionMaxSelectedChoices(question: Question) {
  return question.metadata.selectionMax || question.choices.length;
}

/**
 * Creates an array of SurveyJS validators to be attached to the supplied question.
 * If there is a question with an answer choice  of role "otherExclusive" (e.g.: "none of the above"),
 * then we forbid the simultaneous selection of any other answer choice.
 * We do this only for questions of type "checkbox" as it is not possible to select multiple choices
 * when the question is of type "radiogroup" by definition.
 *
 * See: {@link https://surveyjs.io/form-library/documentation/data-validation}
 *
 * @param {Question} question - The question to create the validators for.
 * @param {number} questionNumber - The number of the question to create the validators for.
 */
function getQuestionValidators(question: Question, questionNumber: number) {
  const validators = [];
  const questionHasNoneAndHasExclusiveOther =
    getQuestionHasNone(question) &&
    question.choices.some((choice) => choice.type === "none of the above");
  if (questionHasNoneAndHasExclusiveOther && getQuestionType(question) === "checkbox") {
    validators.push(getExclusiveOtherValidator(questionLabel(questionNumber)));
  }
  return validators;
}

/**
 * Creates a SurveyJS validator in the form of a custom expression to be attached to the supplied question.
 * It forbids the simultaneous selection of any answer choice together with the one with role "otherExclusive".
 *
 * The expression is constructed as a simple OR of two conditions:
 * 1. `{${questionLabel}} = ['other']` - the "other" choice is selected and nothing else
 * 2. `{${questionLabel}} notcontains 'other'` - the "other" choice is not selected
 *
 * See: {@link https://surveyjs.io/form-library/documentation/data-validation}
 *
 * @param {string} questionLabel - The label of the question to create the validator for.
 */
function getExclusiveOtherValidator(questionLabel: string) {
  return {
    type: "expression",
    text: "This option cannot be combined with other options",
    expression: `{${questionLabel}} = ['other'] or {${questionLabel}} notcontains 'other'`,
  };
}
