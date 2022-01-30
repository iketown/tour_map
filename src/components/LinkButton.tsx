import React from "react";
import { Button } from "@mui/material";
import type { ButtonProps } from "@mui/material";
import NextLink from "next/link";

interface LinkButtonI extends ButtonProps {
  href: string;
  as?: string;
}

const LinkButton: React.FC<LinkButtonI> = ({
  href,
  as,
  children,
  ...otherButtonProps
}) => {
  return (
    <NextLink {...{ href, as }}>
      <Button {...otherButtonProps}>{children}</Button>
    </NextLink>
  );
};

export default LinkButton;
