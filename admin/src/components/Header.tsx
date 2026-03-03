import { AppBar, Toolbar, Typography, Box, Avatar } from "@mui/material";
import { AdminPanelSettings } from "@mui/icons-material";
import { useAuth, getInitials } from "../hooks/useAuth";

export default function Header() {
  const { user, isAdmin } = useAuth();

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <AdminPanelSettings sx={{ mr: 2, fontSize: 28 }} />
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 600 }}
        >
          Admin
        </Typography>
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
