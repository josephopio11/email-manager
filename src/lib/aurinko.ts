/* eslint-disable @typescript-eslint/await-thenable */
"use server";

import { auth } from "@clerk/nextjs/server";

export const getAurinkAuthUrl = async (serviceType: "Google" | "Office365") => {
  const { userId } = await auth();

  if (!userId) throw new Error("Not logged in");

  const params = new URLSearchParams({
    clientId: process.env.AURINKO_CLIENT_ID ?? "",
    serviceType,
    scopes: "Mail.Read Mail.ReadWrite Mail.Send Mail.Drafts Mail.All",
    responseType: "code",
    returnUrl: `${process.env.NEXT_PUBLIC_URL}/api/aurinko/callback`,
  });

  return `https://api.aurink.io/v1/auth/authorize?${params.toString()}`;
};
