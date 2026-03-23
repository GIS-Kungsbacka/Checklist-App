import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import { Checklist } from "@mui/icons-material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
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
          sx={{ flexGrow: 1, fontWeight: 600, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Geodata - Stärka fabriken
        </Typography>
        <IconButton
          onClick={() => onToggleMode()}
          color="inherit"
          aria-label="Toggle dark mode"
          size="small"
        >
          {mode === "light" ? (
            // In light mode we show a "dark" moon icon.
            <Brightness4 />
          ) : (
            // In dark mode we show a "light" sun icon.
            <Brightness7 />
          )}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
