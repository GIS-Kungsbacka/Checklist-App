import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Button,
} from "@mui/material";
import { AdminPanelSettings } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { useAuth, getInitials } from "../hooks/useAuth";

export default function Header() {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <AdminPanelSettings sx={{ mr: 2, fontSize: 28 }} />
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Admin
        </Typography>
        {isAdmin && (
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
              gap: 2,
              mx: 4,
            }}
          >
            <Button
              component={Link}
              to="/bestallningslistan"
              sx={{
                color:
                  location.pathname === "/bestallningslistan" ||
                  location.pathname === "/"
                    ? "inherit"
                    : "rgba(255, 255, 255, 0.7)",
                fontWeight:
                  location.pathname === "/bestallningslistan" ||
                  location.pathname === "/"
                    ? 600
                    : 400,
                "&:hover": {
                  color: "inherit",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Beställningslistan
            </Button>
            <Button
              component={Link}
              to="/idebanken"
              sx={{
                color:
                  location.pathname === "/idebanken"
                    ? "inherit"
                    : "rgba(255, 255, 255, 0.7)",
                fontWeight: location.pathname === "/idebanken" ? 600 : 400,
                "&:hover": {
                  color: "inherit",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Idebanken
            </Button>
            <Button
              component={Link}
              to="/avslutade"
              sx={{
                color:
                  location.pathname === "/avslutade"
                    ? "inherit"
                    : "rgba(255, 255, 255, 0.7)",
                fontWeight: location.pathname === "/avslutade" ? 600 : 400,
                "&:hover": {
                  color: "inherit",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Avslutade
            </Button>
          </Box>
        )}
        {isAdmin && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar
              sx={{
                bgcolor: "grey",
              }}
            >
              {getInitials(user?.username ?? "")}
            </Avatar>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
