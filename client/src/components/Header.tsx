import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { Checklist } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            color="inherit"
            onClick={() => navigate("/")}
            sx={{ textTransform: "none" }}
          >
            Forms
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
