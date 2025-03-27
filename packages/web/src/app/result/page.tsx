"use client";

import { useSubmissionStore } from "@/modules/submission/store";
import { useSurveyStore } from "@/modules/survey/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const submission = useSubmissionStore((state) => state.submission);
  const survey = useSurveyStore((state) => state.survey);
  const router = useRouter();

  useEffect(() => {
    if (submission === null) {
      router.push("/survey");
    }
  }, [submission, router]);

  if (submission === null) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Submission</h1>
      <div>{JSON.stringify(submission, null, 2)}</div>
      <h1>Survey</h1>
      <div>{JSON.stringify(survey, null, 2)}</div>
    </div>
  );
}
