import type { NextApiRequest, NextApiResponse } from "next";
import { Duffel } from "@duffel/api";

export const duffel = new Duffel({
  token: process.env.DUFFEL_TEST_TOKEN!,
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  return res.status(200).json({ hey: "wussup" });
};
