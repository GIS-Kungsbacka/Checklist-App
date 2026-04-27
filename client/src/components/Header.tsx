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
import { useNavigate } from "react-router-dom";

type HeaderProps = {
  mode: "light" | "dark";
  onToggleMode: () => void;
};

export default function Header({ mode, onToggleMode }: HeaderProps) {
  const navigate = useNavigate();

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
          Geodata - utvecklingsvy
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 5,
            mx: "auto", // centers this box horizontally
            justifyContent: "center",
          }}
        >
          <Button color="inherit" onClick={() => navigate("/")}>
            Beställningslista
          </Button>
          <Button color="inherit" onClick={() => navigate("/metadata")}>
            Metadata
          </Button>
          <Button
            sx={{ mr: "200px" }}
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
