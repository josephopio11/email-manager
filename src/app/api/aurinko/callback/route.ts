import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForAccessToken, getAccountDetails } from "~/lib/aurinko";
import { db } from "~/server/db";

export const GET = async (req: NextRequest) => {
  const { userId } = auth();
  if (!userId)
    return NextResponse.json({ message: "Not authorised" }, { status: 401 });

  const params = req.nextUrl.searchParams;
  const status = params.get("status");
  if (status !== "success")
    return NextResponse.json(
      { message: "Failed to link account" },
      { status: 400 },
    );

  // get the code to exchange for access token
  const code = params.get("code");
  if (!code)
    return NextResponse.json({ message: "No code provided" }, { status: 400 });

  const token = await exchangeCodeForAccessToken(code);

  if (!token)
    return NextResponse.json(
      { message: "Failed to exhange code for access token" },
      { status: 400 },
    );

  const accountDetails = await getAccountDetails(token.accessToken);

  if (!accountDetails)
    return NextResponse.json(
      { message: "Failed to fetch account details" },
      { status: 400 },
    );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  await db.account.upsert({
    where: {
      id: token.accountId.toString(),
    },
    update: {
      accessToken: token.accessToken,
    },
    create: {
      id: token.accountId.toString(),
      userId,
      emailAddress: accountDetails.email,
      name: accountDetails.name,
      accessToken: token.accessToken,
    },
  });

  console.log(accountDetails);

  return NextResponse.redirect(new URL("/mail", req.url));
};
