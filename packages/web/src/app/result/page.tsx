"use client";

import { useSubmissionStore } from "@/modules/submission/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const submission = useSubmissionStore((state) => state.submission);
  const router = useRouter();

  useEffect(() => {
    if (submission === null) {
      router.push("/survey");
    }
  }, [submission, router]);

  if (submission === null) {
    return <div>Loading...</div>;
  }

  return <div>{JSON.stringify(submission, null, 2)}</div>;
}
