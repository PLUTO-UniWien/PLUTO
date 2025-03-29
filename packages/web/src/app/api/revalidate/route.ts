import type { StrapiContentTypeID } from "@/modules/strapi/types";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { env } from "@/env";

// Webhook event uid -> to-be-revalidated path mapping
const revalidationMap: Map<StrapiContentTypeID, string> = new Map([
  ["api::home-page.home-page", "/"],
  ["api::feedback-page.feedback-page", "/feedback"],
  ["api::glossary-page.glossary-page", "/glossary"],
  ["api::imprint-page.imprint-page", "/imprint"],
  ["api::post.post", "/news"],
  ["api::privacy-page.privacy-page", "/privacy"],
  ["api::result-page.result-page", "/result"],
  ["api::question.question", "/survey"],
  ["api::survey.survey", "/survey"],
  ["api::weighting-overview-page.weighting-overview-page", "/weighting"],
  ["api::weighting-history-page.weighting-history-page", "/weighting/history"],
]);

/**
 * Handles the POST request from the Strapi webhook.
 *
 * The Strapi webhook is expected to trigger on events:
 * - entry.delete
 * - entry.publish
 * - entry.unpublish
 *
 * The webhook is expected to send a JSON payload with the following structure:
 *
 * ```json
 * {
 *   "event": "entry.publish",
 *   "uid": "api::home-page.home-page"
 * }
 * ```
 *
 * Further, the webhook is expected to be authenticated with a secret via the "Authorization" header.
 * The server is checking for the secret to be present and to match the STRAPI_WEBHOOK_SECRET environment variable.
 *
 * @param request - The incoming request object.
 * @returns A JSON response indicating the success or failure of the request.
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate the request
    const secret = request.headers.get("Authorization");
    if (secret !== env.STRAPI_WEBHOOK_SECRET) {
      return NextResponse.json({ success: false, message: "Invalid secret" }, { status: 401 });
    }

    // Get the JSON payload from the request
    const payload = await request.json();

    // If there is an "event": "trigger-test" in the payload, return a success response
    if (payload.event === "trigger-test") {
      return NextResponse.json(
        { success: true, message: "Webhook received successfully" },
        { status: 200 },
      );
    }

    // Check if uid is present in the payload
    if (!payload.uid) {
      return NextResponse.json(
        { success: false, message: "Missing uid in webhook payload" },
        { status: 400 },
      );
    }

    const uid = payload.uid as StrapiContentTypeID;
    const pathToRevalidate = revalidationMap.get(uid);

    // If there's a matching path, revalidate it
    if (pathToRevalidate) {
      console.log(`Revalidating path: ${pathToRevalidate} for content type: ${uid}`);
      revalidatePath(pathToRevalidate);
      return NextResponse.json(
        {
          success: true,
          message: "Webhook received and page revalidated successfully",
          action: `Revalidated path: ${pathToRevalidate} for content type: ${uid}`,
        },
        { status: 200 },
      );
    }

    // If no matching path found but uid is valid
    return NextResponse.json(
      {
        success: true,
        message: "Webhook received successfully, but no matching path to revalidate",
      },
      { status: 200 },
    );
  } catch (error) {
    // Log error and return error response
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { success: false, message: "Error processing webhook" },
      { status: 500 },
    );
  }
}
