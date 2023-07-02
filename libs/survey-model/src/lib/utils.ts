import { AnswerChoice, Question } from './survey-model';

export function generateSurveyJsModel(questions: Question[]) {
  const coreProperties = {
    title: 'PLUTO - Public Value Assessment Tool',
    showPageTitles: false,
    showProgressBar: 'top',
    questionsOnPageMode: 'questionPerPage',
    showPreviewBeforeComplete: 'showAllQuestions',
    widthMode: 'responsive',
    logo: 'logo.png',
    logoPosition: 'top',
    logoWidth: 120,
    logoHeight: 120,
    logoFit: 'contain',
    completedHtml: ' ',
  };
  const pages = questions.map((question, questionNumber) => {
    const name = pageLabel(questionNumber + 1);
    const elements = [mapQuestion(question, questionNumber + 1)];
    return { name, elements };
  });
  return { ...coreProperties, pages };
}

function pageLabel(pageNumber: number) {
  return `P${pageNumber}`;
}
export function pageLabelInverse(label: string) {
  const pageNumber = parseInt(label.slice(1), 10);
  return { pageNumber };
}

export function answerChoiceLabel(
  questionNumber: number,
  choiceNumber: number
) {
  return `A${questionNumber}.${choiceNumber}`;
}
export function answerChoiceLabelInverse(label: string) {
  const [questionNumberString, choiceNumberString] = label.split('.');
  const questionNumber = parseInt(questionNumberString.slice(1), 10);
  const choiceNumber = parseInt(choiceNumberString, 10);
  return { questionNumber, choiceNumber };
}

function mapAnswerChoice(
  choice: AnswerChoice,
  questionNumber: number,
  choiceNumber: number
) {
  return {
    value: answerChoiceLabel(questionNumber, choiceNumber),
    text: choice.body,
  };
}

function questionLabel(questionNumber: number) {
  return `Q${questionNumber}`;
}
export function questionLabelInverse(label: string) {
  const questionNumber = parseInt(label.slice(1), 10);
  return { questionNumber };
}

function mapQuestion(question: Question, questionNumber: number) {
  const type = getQuestionType(question);
  const name = questionLabel(questionNumber);
  const title = `${question.body} (${getTickHint(question)})`;
  const isRequired = true;
  const validators = getQuestionValidators(question, questionNumber);
  const choices = question.choices
    .filter((choice) => choice.type === 'regular')
    .map((choice, choiceNumber) =>
      mapAnswerChoice(choice, questionNumber, choiceNumber + 1)
    );
  const separateSpecialChoices = false;
  const hasOther = getQuestionHasOther(question);
  const otherText = hasOther && getQuestionOtherText(question);
  const hasNone = getQuestionHasNone(question);
  const noneText = hasNone && getQuestionNoneText(question);
  const maxSelectedChoices =
    type === 'checkbox' && getQuestionMaxSelectedChoices(question);
  return {
    type,
    name,
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

function getTickHint(question: Question) {
  const { start, end } = question.metadata.selection;
  const numChoices = question.choices.length;
  if (start === 1 && end === 1) {
    return 'tick one';
  } else if (start === 1 && end === numChoices) {
    return 'tick as many as necessary';
  }
  return `tick up to ${numberToWord(end)}`;
}

function numberToWord(number: number) {
  const words = [
    'zero',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
  ];
  return words[number];
}

function getQuestionType(question: Question) {
  const { selection } = question.metadata;
  if (selection.start === 1 && selection.end === 1) {
    return 'radiogroup';
  } else {
    return 'checkbox';
  }
}

export function getQuestionHasOther(question: Question) {
  return question.choices.some(
    (choice) =>
      choice.type === 'otherExclusive' || choice.type === 'otherInclusive'
  );
}

function getQuestionOtherText(question: Question) {
  const choice = question.choices.find(
    (choice) =>
      choice.type === 'otherExclusive' || choice.type === 'otherInclusive'
  );
  if (choice) {
    return choice.body;
  }
  throw new Error('Question does not have an other choice');
}

export function getQuestionHasNone(question: Question) {
  return question.choices.some((choice) => choice.type === 'none');
}

function getQuestionNoneText(question: Question) {
  const choice = question.choices.find((choice) => choice.type === 'none');
  if (choice) {
    return choice.body;
  }
  throw new Error('Question does not have a none choice');
}

function getQuestionMaxSelectedChoices(question: Question) {
  const { selection } = question.metadata;
  return selection.end;
}

function getQuestionValidators(question: Question, questionNumber: number) {
  const validators = [];
  const questionHasNoneAndHasExclusiveOther =
    getQuestionHasNone(question) &&
    question.choices.some((choice) => choice.type === 'otherExclusive');
  if (
    questionHasNoneAndHasExclusiveOther &&
    getQuestionType(question) === 'checkbox'
  ) {
    validators.push(getExclusiveOtherValidator(questionLabel(questionNumber)));
  }
  return validators;
}

function getExclusiveOtherValidator(questionLabel: string) {
  return {
    type: 'expression',
    text: 'This option cannot be combined with other options',
    expression: `{${questionLabel}} = ['other'] or {${questionLabel}} notcontains 'other'`,
  };
}
