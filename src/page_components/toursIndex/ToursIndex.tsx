import { LocalPrintshopSharp } from "@mui/icons-material";
import { Box, Grid } from "@mui/material";
import { doc, onSnapshot, query, collection, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import LinkButton from "~/components/LinkButton";
import { useAuthCtx } from "~/contexts/AuthCtx";
import Layout from "~/layout/Layout";
import { db } from "~/utils/firebase/clientApp";
import TourLinkCard from "./TourLinkCard";

interface ToursIndexI {
  // myTours: { [tour_id: string]: Tour };
}
const ToursIndex: React.FC<ToursIndexI> = ({}) => {
  const [myTours, setMyTours] = useState<{ [tour_id: string]: Tour }>({});
  const { user_id } = useAuthCtx();
  useEffect(() => {
    if (!user_id) return;
    const q = query(
      collection(db, "tours"),
      where("created_by", "==", user_id)
    );
    const unsub = onSnapshot(q, (snap) => {
      const _myTours: { [tour_id: string]: Tour } = {};
      snap.docChanges().forEach(({ doc }) => {
        _myTours[doc.id] = doc.data() as Tour;
      });
      setMyTours(_myTours);
    });
    return unsub;
  }, [user_id]);
  return (
    <Layout>
      tours index
      <Box sx={{ p: 2 }}>
        <LinkButton variant="contained" size="large" href="/admin/tours/add">
          Create a Tour
        </LinkButton>
      </Box>
      <Grid container>
        {myTours &&
          Object.entries(myTours).map(([tour_id, tourInfo]) => {
            return (
              <Grid key={tour_id} item xs={12} sm={6}>
                <TourLinkCard key={tour_id} tourInfo={tourInfo} />
              </Grid>
            );
          })}
      </Grid>
    </Layout>
  );
};

export default ToursIndex;
