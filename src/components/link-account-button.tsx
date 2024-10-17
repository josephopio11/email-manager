"use client";

import { getAurinkAuthUrl } from "~/lib/aurinko";
import { Button } from "./ui/button";

const LinkAccountButton = () => {
  return (
    <Button
      onClick={async () => {
        const authUrl = await getAurinkAuthUrl("Office365");
        window.location.href = authUrl;
        // console.log(authUrl);
      }}
    >
      LinkAccountButton
    </Button>
  );
};

export default LinkAccountButton;
