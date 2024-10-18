"use client";
import { Button } from "@/components/ui/button";
import { getAurinkoAuthorizationUrl } from "@/lib/aurinko";
import { api } from "@/trpc/react";
import { useLocalStorage } from "usehooks-ts";

export default function AuthoriseButton() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const syncEmails = api.mail.syncEmails.useMutation();
  const [accountId, setAccountId] = useLocalStorage("accountId", "");
  return (
    <div className="flex flex-col gap-2">
      <Button
        size="sm"
        variant={"outline"}
        onClick={() => {
          if (!accountId) return;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          syncEmails.mutate({ accountId });
        }}
      >
        Sync Emails
      </Button>
      <Button
        size="sm"
        variant={"outline"}
        onClick={async () => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
          const url = await getAurinkoAuthorizationUrl("Office365");
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          window.location.href = url;
        }}
      >
        Authorize Email
      </Button>
    </div>
  );
}
