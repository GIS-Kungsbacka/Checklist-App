import { AppBar, Toolbar, Typography } from "@mui/material";
import { Checklist } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <AppBar position="static" elevation={2}>
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
      </Toolbar>
    </AppBar>
  );
}
