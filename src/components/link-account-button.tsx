"use client";

import { getAurinkAuthUrl } from "~/lib/aurinko";
import { Button } from "./ui/button";

const LinkAccountButton = () => {
  return (
    <Button
      onClick={async () => {
        const authUrl = await getAurinkAuthUrl("Google");
        console.log(authUrl);
      }}
    >
      LinkAccountButton
    </Button>
  );
};

export default LinkAccountButton;
