import React from "react";
import Layout from "~/layout/Layout";
import { Button } from "@mui/material";
//@ts-ignore
import icsToJson from "ics-to-json";
import axios from "axios";
const convert = async (URL) => {
  const icsRes = await axios.get(URL, {
    headers: {},
  });
  console.log("icsRes", icsRes);
  const icsData = await icsRes.text();
  // Convert
  const data = icsToJson(icsData);
  return data;
};

const bbCal =
  "https://calendar.google.com/calendar/u/0/embed?src=c_phn1dltd29indm8nt3f4arhehk@group.calendar.google.com&ctz=America/Chicago";
const IcsTestPage = () => {
  const getCal = async () => {
    const data = await convert(bbCal);
    console.log(data);
  };
  return (
    <Layout>
      <div>IcsTestPage test</div>
      <Button onClick={getCal}>get cal</Button>
    </Layout>
  );
};

export default IcsTestPage;
