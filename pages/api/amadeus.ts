import type { NextApiRequest, NextApiResponse } from "next";
//@ts-ignore
import Amadeus from "amadeus";

const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_CLIENT_ID,
  clientSecret: process.env.AMADEUS_CLIENT_SECRET,
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  return amadeus.shopping.flightOffersSearch
    .get({
      originLocationCode: "BOS",
      destinationLocationCode: "MSP",
      departureDate: "2022-07-01",
      adults: "1",
    })
    .then(function (data: any) {
      console.log(JSON.stringify(data));
      return res.status(200).json(data);
    })
    .catch(function (responseError: any) {
      console.log(JSON.stringify(responseError));
      return res.status(400).json(responseError);
    });
};
