import AccountCircle from "@mui/icons-material/AccountCircle";
import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";

import * as React from "react";
import { useAuth, signOutUser } from "~/hooks/auth/useAuth";

import Link from "~/components/Link";

import { useRouter } from "next/router";
import LinkButton from "~/components/LinkButton";

export default function MenuAppBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [user, loading, error] = useAuth();

  const { push, query } = useRouter();
  const tour_id = query.tour_id as string | undefined;
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSignOut = async () => {
    await signOutUser();
    handleClose();
    push("/auth/signin");
  };

  const userMenu = [
    <MenuItem
      key="Profile"
      onClick={() => {
        push("/admin");
        handleClose();
      }}
    >
      {user?.email || "no email"}
    </MenuItem>,
    <MenuItem key="my_account" onClick={handleClose}>
      My account
    </MenuItem>,
    <MenuItem key="sign_out" onClick={handleSignOut}>
      Sign Out
    </MenuItem>,
  ];
  const noUserMenu = [
    <Link href="/auth/signin" key="sign_in" sx={{ textDecoration: "none" }}>
      <MenuItem onClick={handleClose}>Sign In</MenuItem>
    </Link>,
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            href="/"
            component={Link}
            color="inherit"
            sx={{ flexGrow: 1 }}
          >
            Tour Map
          </Typography>
          {tour_id && (
            <div>
              <LinkButton
                color="inherit"
                href="/admin/tours/[tour_id]/gcal"
                as={`/admin/tours/${tour_id}/gcal`}
              >
                Google Cal
              </LinkButton>
            </div>
          )}
          <div>
            <Button component={Link} href="/admin/tours" color="inherit">
              Tours
            </Button>
          </div>

          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {user ? userMenu : noUserMenu}
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
