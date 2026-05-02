"use server";
import argon2 from "argon2";
import type { NextRequest } from "next/server";

export type AuthValidationResult =
  | { authorized: true }
  | { authorized: false; response: Response };

/**
 * Validates the authorization header against the workflow password hash
 * @param req - The Next.js request object
 * @returns Object with authorization status and optional error response
 */
export async function validateAdminWorkflowAuth(
  req: NextRequest,
): Promise<AuthValidationResult> {
  const authHeader = req.headers.get("Authorization");
  const workflowPasswordHash = process.env.WORKFLOW_PASSWORD_HASH;

  if (!authHeader || !workflowPasswordHash) {
    return {
      authorized: false,
      response: new Response(
        JSON.stringify({ ok: false, error: "Unauthorized" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    };
  }

  const encodedPassword = decodeURIComponent(
    authHeader.replace("Bearer ", "").trim(),
  );

  const hashVerified = await argon2.verify(
    workflowPasswordHash,
    encodedPassword,
  );

  if (!hashVerified) {
    return {
      authorized: false,
      response: new Response(
        JSON.stringify({ ok: false, error: "Unauthorized" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        },
      ),
    };
  }

  return { authorized: true };
}
