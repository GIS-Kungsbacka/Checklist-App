import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Divider,
} from "@mui/material";
import {
  AdminPanelSettings,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";

import { Link, useLocation } from "react-router-dom";
import { useAuth, getInitials } from "../hooks/useAuth";

type HeaderProps = {
  mode: "light" | "dark";
  onToggleMode: () => void;
};

export default function Header({ mode, onToggleMode }: HeaderProps) {
  const { user, isAdmin } = useAuth();
  const location = useLocation();
  const [openChecklistor, setOpenChecklistor] = useState(true);
  const [openMetadatakatalog, setOpenMetadatakatalog] = useState(false);
  const [openForvaltningsplan, setOpenForvaltningsplan] = useState(false);

  const handleToggleChecklistor = () => {
    setOpenChecklistor((prev) => !prev);
  };

  const handleToggleMetadatakatalog = () => {
    setOpenMetadatakatalog((prev) => !prev);
  };

  const handleToggleForvaltningsplan = () => {
    setOpenForvaltningsplan((prev) => !prev);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={2}
        sx={{ bgcolor: "background.paper", color: "text.primary" }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <AdminPanelSettings sx={{ mr: 2, fontSize: 28 }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              Admin
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              onClick={onToggleMode}
              color="inherit"
              aria-label="Toggle dark mode"
              size="small"
            >
              {mode === "light" ? (
                <LightModeOutlinedIcon />
              ) : (
                <DarkModeOutlinedIcon />
              )}
            </IconButton>
            {isAdmin && (
              <Avatar
                sx={{
                  bgcolor: "grey",
                }}
              >
                {getInitials(user?.username ?? "")}
              </Avatar>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {isAdmin && (
        <Box
          sx={{
            position: "fixed",
            top: (theme) => theme.mixins.toolbar.minHeight ?? 64,
            bottom: 0,
            left: 0,
            width: 240,
            bgcolor: "background.paper",
            color: "text.primary",
            borderRight: 1,
            borderColor: "divider",
            pt: 2,
            zIndex: (theme) => theme.zIndex.appBar - 1,
          }}
        >
          <List component="nav" disablePadding>
            <ListItemButton onClick={handleToggleChecklistor}>
              <ListItemText
                primary="Checklista"
                slotProps={{ primary: { fontWeight: 600 } }}
              />
              {openChecklistor ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openChecklistor} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ px: 1, pt: 1 }}>
                <ListItemButton
                  component={Link}
                  to="/bestallningslistan"
                  selected={
                    location.pathname === "/bestallningslistan" ||
                    location.pathname === "/"
                  }
                  sx={{
                    pl: 4,
                    mb: 1,
                    borderRadius: 2,
                    bgcolor: (theme) => theme.palette.action.selected,
                    "&.Mui-selected": {
                      bgcolor: (theme) => theme.palette.action.hover,
                    },
                    "&:hover": {
                      bgcolor: (theme) => theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemText
                    primary="Beställningslistan"
                    slotProps={{
                      primary: {
                        fontWeight:
                          location.pathname === "/bestallningslistan" ||
                          location.pathname === "/"
                            ? 700
                            : 400,
                      },
                    }}
                  />
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="/idebanken"
                  selected={location.pathname === "/idebanken"}
                  sx={{
                    pl: 4,
                    mb: 1,
                    borderRadius: 2,
                    bgcolor: (theme) => theme.palette.action.selected,
                    "&.Mui-selected": {
                      bgcolor: (theme) => theme.palette.action.hover,
                    },
                    "&:hover": {
                      bgcolor: (theme) => theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemText
                    primary="Idebanken"
                    slotProps={{
                      primary: {
                        fontWeight:
                          location.pathname === "/idebanken" ? 700 : 400,
                      },
                    }}
                  />
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="/avslutade"
                  selected={location.pathname === "/avslutade"}
                  sx={{
                    pl: 4,
                    mb: 1,
                    borderRadius: 2,
                    bgcolor: (theme) => theme.palette.action.selected,
                    "&.Mui-selected": {
                      bgcolor: (theme) => theme.palette.action.hover,
                    },
                    "&:hover": {
                      bgcolor: (theme) => theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemText
                    primary="Avslutade"
                    slotProps={{
                      primary: {
                        fontWeight:
                          location.pathname === "/avslutade" ? 700 : 400,
                      },
                    }}
                  />
                </ListItemButton>
              </List>
            </Collapse>

            <ListItemButton onClick={handleToggleMetadatakatalog}>
              <ListItemText
                primary="Metadatakatalog"
                slotProps={{ primary: { fontWeight: 600 } }}
              />
              {openMetadatakatalog ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openMetadatakatalog} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ px: 1, pt: 1 }}>
                <ListItemButton
                  component={Link}
                  to="/metadata"
                  selected={location.pathname === "/metadata"}
                  sx={{
                    pl: 4,
                    mb: 1,
                    borderRadius: 2,
                    bgcolor: (theme) => theme.palette.action.selected,
                    "&.Mui-selected": {
                      bgcolor: (theme) => theme.palette.action.hover,
                    },
                    "&:hover": {
                      bgcolor: (theme) => theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemText
                    primary="Tabell"
                    slotProps={{
                      primary: {
                        fontWeight:
                          location.pathname === "/metadata" ? 700 : 400,
                      },
                    }}
                  />
                </ListItemButton>
              </List>
            </Collapse>

            <ListItemButton onClick={handleToggleForvaltningsplan}>
              <ListItemText
                primary="Förvaltningsplan"
                slotProps={{ primary: { fontWeight: 600 } }}
              />
              {openForvaltningsplan ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={openForvaltningsplan} timeout="auto" unmountOnExit>
              <List component="div" disablePadding sx={{ px: 1, pt: 1 }}>
                <ListItemButton
                  component={Link}
                  to="/management-plan"
                  selected={location.pathname === "/management-plan"}
                  sx={{
                    pl: 4,
                    mb: 1,
                    borderRadius: 2,
                    bgcolor: (theme) => theme.palette.action.selected,
                    "&.Mui-selected": {
                      bgcolor: (theme) => theme.palette.action.hover,
                    },
                    "&:hover": {
                      bgcolor: (theme) => theme.palette.action.hover,
                    },
                  }}
                >
                  <ListItemText
                    primary="Tabell"
                    slotProps={{
                      primary: {
                        fontWeight:
                          location.pathname === "/management-plan" ? 700 : 400,
                      },
                    }}
                  />
                </ListItemButton>
              </List>
            </Collapse>
          </List>
          <Divider />
        </Box>
      )}
    </>
  );
}
