import { NextResponse, type NextRequest } from "next/server";
import { Account } from "~/lib/account";
import { syncEmailsToDatabase } from "~/lib/sync-to-db";
import { db } from "~/server/db";

export const POST = async (req: NextRequest) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { accountId, userId } = await req.json();

  if (!accountId || !userId) {
    return NextResponse.json(
      { error: "Missing accountId or userId" },
      { status: 400 },
    );
  }

  const accountIdentifier = String(accountId);
  const userIdentifier = String(userId);

  const dbAccount = await db.account.findUnique({
    where: {
      id: accountIdentifier,
      userId: userIdentifier,
    },
  });

  if (!dbAccount)
    return NextResponse.json({ error: "Account not found" }, { status: 404 });

  const account = new Account(dbAccount.accessToken);
  const response = await account.performInitialSync();

  if (!response)
    return NextResponse.json(
      { error: "Failed to perform initial sync" },
      { status: 500 },
    );

  const { emails, deltaToken } = response;

  console.log("========Emails========", emails);

  // await db.account.update({
  //   where: {
  //     id: accountIdentifier,
  //   },
  //   data: {
  //     nextDeltaToken: deltaToken,
  //   },
  // });

  await syncEmailsToDatabase(emails);

  console.log("Sync completed successfully", deltaToken);

  return NextResponse.json({ success: true }, { status: 200 });
};
