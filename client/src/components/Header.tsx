import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
} from "@mui/material";
import { Checklist } from "@mui/icons-material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import { useLocation, useNavigate } from "react-router-dom";

type HeaderProps = {
  mode: "light" | "dark";
  onToggleMode: () => void;
};

export default function Header({ mode, onToggleMode }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (kind: "orders" | "metadata" | "managementplan") => {
    const p = location.pathname;
    if (kind === "orders") return p === "/" || p.startsWith("/checklist/");
    if (kind === "metadata")
      return p === "/metadata" || p.startsWith("/metadata/");
    return p === "/managementplan" || p.startsWith("/managementplan/");
  };

  const navButtonSx = (active: boolean) => ({
    px: 1.5,
    borderRadius: 1.5,
    borderBottom: "2px solid",
    borderBottomColor: active ? "primary.main" : "transparent",
    fontWeight: active ? 700 : 500,
    opacity: active ? 1 : 0.9,
    "&:hover": {
      opacity: 1,
      borderBottomColor: "primary.main",
      backgroundColor: "action.hover",
    },
  });

  return (
    <AppBar
      position="static"
      elevation={2}
      sx={{ bgcolor: "background.paper", color: "text.primary" }}
    >
      <Toolbar sx={{ display: "flex", alignItems: "center" }}>
        <Checklist sx={{ mr: 2, fontSize: 28 }} />
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: 600, cursor: "pointer", width: "fit-content" }}
          onClick={() => navigate("/")}
        >
          Geodata - utvecklingsportalen
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 5,
            mx: "auto", // centers this box horizontally
            justifyContent: "center",
          }}
        >
          <Button
            color="inherit"
            sx={navButtonSx(isActive("orders"))}
            onClick={() => navigate("/")}
          >
            Beställningslista
          </Button>
          <Button
            color="inherit"
            sx={navButtonSx(isActive("metadata"))}
            onClick={() => navigate("/metadata")}
          >
            Metadata
          </Button>
          <Button
            sx={{ ...navButtonSx(isActive("managementplan")), mr: "200px" }}
            color="inherit"
            onClick={() => navigate("/managementplan")}
          >
            Förvaltningsplan
          </Button>
        </Box>
        <IconButton
          onClick={() => onToggleMode()}
          color="inherit"
          aria-label="Toggle dark mode"
          size="small"
        >
          {mode === "light" ? (
            // In light mode we show a "dark" moon icon.
            <LightModeOutlinedIcon />
          ) : (
            // In dark mode we show a "light" sun icon.
            <DarkModeOutlinedIcon />
          )}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
