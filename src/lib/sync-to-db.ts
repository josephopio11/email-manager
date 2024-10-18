import pLimit from "p-limit";
import { type EmailMessage } from "./types";

export async function syncEmailsToDatabase(
  emails: EmailMessage[],
  accountId: string,
) {
  console.log("Attempting to sync", emails.length, "emails");

  const limit = pLimit(10);

  try {
    Promise.all(emails.map((email) => limit(() => saveEmail(email))));
  } catch (error) {}
}
