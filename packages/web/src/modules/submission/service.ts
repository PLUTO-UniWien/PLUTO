import type { StrapiClient } from "@/modules/strapi/client";
import type { StrapiSubmission } from "./types";
import type { APIResponseData } from "@/modules/strapi/types";

export async function storeSubmission(client: StrapiClient, submission: StrapiSubmission) {
  const submissions = client.collection("submissions");
  const submissionResponse = (await submissions.create(
    submission,
  )) as unknown as APIResponseData<"api::submission.submission">;

  return submissionResponse.data;
}
