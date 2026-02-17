import { AppBar, Toolbar, Typography, Box } from "@mui/material";
import { AdminPanelSettings } from "@mui/icons-material";

export default function Header() {
  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <AdminPanelSettings sx={{ mr: 2, fontSize: 28 }} />
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 600 }}
        >
          Checklist Admin Panel
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Manage Forms & Responses
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
