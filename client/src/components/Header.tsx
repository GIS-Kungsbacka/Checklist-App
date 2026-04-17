import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
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
      <Toolbar>
        <Checklist sx={{ mr: 2, fontSize: 28 }} />
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: 600, cursor: "pointer", width: "fit-content" }}
          onClick={() => navigate("/")}
        >
          Geodata - beställningslista
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
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
