/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// /api/clerk/webhook

import { db } from "~/server/db";

export const POST = async (req: Request) => {
  const { data } = await req.json();
  //   console.log("Clerk webhook received", data);

  const emailAddress = data.email_addresses[0].email_address;
  const firstName = data.first_name;
  const lastName = data.last_name;
  const imageUrl = data.image_url;
  const id = data.id;

  const user = await db.user.upsert({
    where: { id: id },
    create: {
      id: id,
      emailAddress: emailAddress,
      firstName: firstName,
      lastName: lastName,
      imageUrl: imageUrl,
    },
    update: {
      emailAddress: emailAddress,
      firstName: firstName,
      lastName: lastName,
      imageUrl: imageUrl,
    },
  });

  console.log(user);

  return new Response("Webhook received", { status: 200 });
};

// export const GET = (req: Request) => {
//   console.log(req);
//   return new Response(`This is the get route in the clerk webhook`, {
//     status: 200,
//   });
// };
