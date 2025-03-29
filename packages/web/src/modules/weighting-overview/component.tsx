import BlocksRenderer from "@/modules/strapi/blocks-renderer";
import type { StrapiWeightingOverviewPage } from "./types";
import type { AnswerChoice, Question, StrapiSurvey } from "@/modules/survey/types";

type WeightingOverviewComponentProps = {
  weightingOverview: StrapiWeightingOverviewPage;
  survey: StrapiSurvey;
};

export default function WeightingOverviewComponent({
  weightingOverview,
  survey,
}: WeightingOverviewComponentProps) {
  const { content } = weightingOverview;
  const questionLabelsByQuestionId = survey.groups
    .flatMap((group) => group.questions)
    .reduce(
      (acc, question, index) =>
        Object.assign(acc, {
          [(question as Question).id]: `Q${index + 1}.`,
        }),
      {} as Record<number, string>,
    );
  return (
    <div className="container mx-auto py-4 space-y-8">
      <div className="prose prose-lg max-w-none">
        <BlocksRenderer content={content} />
      </div>
      <div className="space-y-12">
        {survey.groups.map((group) => (
          <ExplainedQuestionGroup
            key={group.title.toLowerCase()}
            title={group.title}
            items={
              (group.questions as Question[]).map((question) => ({
                label: questionLabelsByQuestionId[question.id],
                question,
              })) ?? []
            }
          />
        ))}
      </div>
    </div>
  );
}

type ExplainedQuestionGroupProps = {
  title: string;
  items: { label: string; question: Question }[];
};

function ExplainedQuestionGroup({ title, items }: ExplainedQuestionGroupProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>
      <div className="space-y-8">
        {items.map((item) => (
          <ExplainedQuestion key={item.question.id} label={item.label} question={item.question} />
        ))}
      </div>
    </div>
  );
}

type ExplainedQuestionProps = {
  label: string;
  question: Question;
};

function ExplainedQuestion({ label, question }: ExplainedQuestionProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-xl font-medium text-gray-900">
          {label} {question.body}
        </h3>
        <div className="text-gray-600 text-sm italic">
          <BlocksRenderer content={question.explanation} />
        </div>
        <p className="text-sm font-medium text-gray-700">Impact: {question.metadata.impact}</p>
      </div>
      <div className="space-y-2">
        {question.choices.map((choice, index) => (
          <QuestionAnswerChoiceItem
            key={`${question.id}-${index}`}
            impact={question.metadata.impact}
            choice={choice as AnswerChoice}
          />
        ))}
      </div>
      {question.weightingRationale && (
        <div className="mt-4">
          <h4 className="font-medium text-gray-900 mb-2">Explanation</h4>
          <div className="text-gray-600 text-sm">
            <BlocksRenderer content={question.weightingRationale} />
          </div>
        </div>
      )}
    </div>
  );
}

type QuestionAnswerChoiceItemProps = {
  impact: Question["metadata"]["impact"];
  choice: AnswerChoice;
};

function QuestionAnswerChoiceItem({ impact, choice }: QuestionAnswerChoiceItemProps) {
  const colorNeutral = "bg-gray-100 text-gray-600";
  const colorPositive = "bg-green-100 text-green-800";
  const colorNegative = "bg-pink-100 text-pink-800";
  const normalizedWeight = impact === "risk" ? -choice.weight : choice.weight;
  const color =
    normalizedWeight === 0 ? colorNeutral : normalizedWeight > 0 ? colorPositive : colorNegative;

  const formatWeight = (weight: number) => {
    if (weight === 0) return "0";
    const absWeight = Math.abs(weight);
    return weight > 0 ? `+${absWeight}` : `-${absWeight}`;
  };

  return (
    <div className="group relative flex items-center rounded-xl border border-gray-200 bg-white p-6 hover:border-gray-300">
      <div className="min-h-[1.5rem] flex-1 text-[15px] text-gray-700">{choice.body}</div>
      <div
        className={`${color} ml-4 flex h-8 w-12 shrink-0 items-center justify-center rounded-full text-sm font-medium`}
      >
        {formatWeight(choice.weight)}
      </div>
    </div>
  );
}
