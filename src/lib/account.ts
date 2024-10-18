import axios from "axios";
import {
  type EmailMessage,
  type SyncResponse,
  type SyncUpdatedResponse,
} from "./types";

export class Account {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  async getUpdatedEmails({
    deltaToken,
    pageToken,
  }: {
    deltaToken?: string;
    pageToken?: string;
  }) {
    const params: Record<string, string> = {};
    if (deltaToken) params.deltaToken = deltaToken;
    if (pageToken) params.pageToken = pageToken;

    const response = await axios.get<SyncUpdatedResponse>(
      "https://api.aurinko.io/v1/email/updated",
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        params,
      },
    );

    return response.data;
  }

  private async startSync() {
    const response = await axios.post<SyncResponse>(
      "https://api.aurinko.io/v1/email/sync",
      {},
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        params: {
          daysWithin: 2,
          bodyType: "html",
        },
      },
    );

    return response.data;
  }

  async performInitialSync() {
    try {
      let syncResponse = await this.startSync();

      while (!syncResponse.ready) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        syncResponse = await this.startSync();
      }

      let storedDeltaToken: string = syncResponse.syncUpdatedToken;

      let updatedResponse = await this.getUpdatedEmails({
        deltaToken: storedDeltaToken,
      });

      if (updatedResponse.nextDeltaToken) {
        storedDeltaToken = updatedResponse.nextDeltaToken;
      }
      let allEmails: EmailMessage[] = updatedResponse.records;
      // fetch all pages while there are more
      while (updatedResponse.nextPageToken) {
        updatedResponse = await this.getUpdatedEmails({
          pageToken: updatedResponse.nextPageToken,
        });
        allEmails = allEmails.concat(updatedResponse.records);
        if (updatedResponse.nextPageToken) {
          // sync has ended
          storedDeltaToken = updatedResponse.nextDeltaToken;
        }
      }

      console.log(
        `Initial sync completed, we have synced ${allEmails.length} emails.`,
      );

      // store the latest delta toke for future syncs
      await this.getUpdatedEmails({ deltaToken: storedDeltaToken });

      return {
        emails: allEmails,
        deltaToken: storedDeltaToken,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Error during sync",
          JSON.stringify(error.response?.data, null, 2),
        );
      } else {
        console.error(error);
      }
    }
  }
}