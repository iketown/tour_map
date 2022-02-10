import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  CardActionArea,
} from "@mui/material";
import NextLink from "next/link";

interface TourLinkCardI {
  tourInfo: Tour;
}
const TourLinkCard: React.FC<TourLinkCardI> = ({ tourInfo }) => {
  return (
    <Card>
      <NextLink
        href="/admin/tours/[tour_id]"
        as={`/admin/tours/${tourInfo.tour_id}`}
      >
        <CardActionArea>
          <CardContent>
            <Typography>{tourInfo.title}</Typography>
          </CardContent>
        </CardActionArea>
      </NextLink>
    </Card>
  );
};

export default TourLinkCard;
