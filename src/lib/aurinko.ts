/* eslint-disable @typescript-eslint/await-thenable */
"use server";

import { auth } from "@clerk/nextjs/server";
import axios from "axios";

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

  return `https://api.aurinko.io/v1/auth/authorize?${params.toString()}`;
};

export const exchangeCodeForAccessToken = async (code: string) => {
  try {
    const response = await axios.post(
      `https://api.aurinko.io/v1/auth/token/${code}`,
      {},
      {
        auth: {
          username: process.env.AURINKO_CLIENT_ID ?? "",
          password: process.env.AURINKO_CLIENT_SECRET ?? "",
        },
      },
    );

    return response.data as {
      accountId: number;
      accessToken: string;
      userId: string;
      userSession: string;
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching account details", error.response?.data);
    }
    console.log(error);
  }
};

export const getAccountDetails = async (accessToken: string) => {
  try {
    const response = await axios.get(`https://api.aurinko.io/v1/account`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data as {
      email: string;
      name: string;
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching account details", error.response?.data);
    }
    console.log(error);
  }
};
