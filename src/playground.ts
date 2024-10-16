/* eslint-disable @typescript-eslint/no-unsafe-call */
import { db } from "./server/db";

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
await db.user.create({
  data: {
    emailAddress: "j@j.com",
    firstName: "John",
    lastName: "Doe",
  },
});
