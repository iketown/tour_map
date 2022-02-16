import type { NextApiRequest, NextApiResponse } from "next";
import { airports } from "./airportsByLinks";
import { within, bbox } from "@turf/turf";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { lat, lng, km = 250 } = req.body;
  if (!lat || !lng) return res.status(400).send("must send lat lng ");
  const { ne, sw } = req.body;
  console.log({ ne, sw });
  return res.status(200).json({ airports: "hey" });
};
