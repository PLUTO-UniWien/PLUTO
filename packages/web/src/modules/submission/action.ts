"use server";

import strapiClient from "@/modules/strapi/client";
import { storeSubmission } from "./service";
import type { StrapiSubmission } from "./types";

export async function createSubmission(submission: Omit<StrapiSubmission, "id">) {
  return await storeSubmission(strapiClient, submission);
}
