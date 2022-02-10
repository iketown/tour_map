import { Box, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useField } from "react-final-form";
import slugify from "slugify";

const TourSlugify = () => {
  const {
    input: { value: title },
  } = useField("title");
  const { input } = useField("slug");
  useEffect(() => {
    //todo check for unique tour slug
    input.onChange(
      title
        ? slugify(title, {
            replacement: "_",
            lower: true,
          })
        : ""
    );
  }, [title]);
  return (
    <Box mb={2} textAlign={"center"}>
      <Typography>
        First, you'll give this tour a name. This is probably the artist/band
        name + year.
      </Typography>
      <Typography variant="caption" color="GrayText">
        for example {`Lake Street Dive ${new Date().getFullYear()}`}
      </Typography>
      <Typography>** once this is chosen it can't be changed. **</Typography>
      <Typography sx={{ pt: 2 }} color="GrayText" variant="subtitle1">
        accesible at:{" "}
      </Typography>
      <Typography component="h5" variant="h5" sx={{ pt: 0 }}>
        https://www.tourview.com/
        <b>{input.value}</b>
      </Typography>
    </Box>
  );
};

export default TourSlugify;
