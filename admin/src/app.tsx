import { useMemo, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";
import ChecklistGrid from "./pages/checklist/checklist-data-grid";
import Idebanken from "./pages/checklist/Idebanken";
import Avslutade from "./pages/checklist/Avslutade";
import MetadataPage from "./pages/metadata";
import ManagementPlanPage from "./pages/management-plan";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import ChecklistItemViewer from "./pages/checklist/ChecklistItemViewer";
import { queryConfig } from "../lib/react-query";
import { useBroadcastSync } from "../lib/useBroadcastSync";

const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

function AppContent() {
  useBroadcastSync();
  const [mode, setMode] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("admin-theme-mode");
    return saved === "dark" ? "dark" : "light";
  });

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#1976d2",
          },
          secondary: {
            main: "#dc004e",
          },
        },
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          h4: {
            fontWeight: 700,
          },
          h5: {
            fontWeight: 600,
          },
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: "none",
                fontWeight: 500,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 12,
              },
            },
          },
        },
      }),
    [mode]
  );

  const toggleMode = () => {
    setMode((prev) => {
      const next = prev === "light" ? "dark" : "light";
      localStorage.setItem("admin-theme-mode", next);
      return next;
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <Header mode={mode} onToggleMode={toggleMode} />
          <Box
            sx={(theme) => ({
              flexGrow: 1,
              ml: "240px",
              px: 3,
              mt: 2,
              display: "flex",
              alignItems: { xs: "flex-start", md: "flex-start" },
              justifyContent: "center",
              pt: {
                xs: `calc(${
                  theme.mixins.toolbar.minHeight || 64
                }px + ${theme.spacing(2)})`,
                md: theme.spacing(5),
              },
              pb: { xs: theme.spacing(3), md: 0 },
            })}
          >
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <ChecklistGrid mode={mode} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bestallningslistan"
                element={
                  <ProtectedRoute>
                    <ChecklistGrid mode={mode} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/idebanken"
                element={
                  <ProtectedRoute>
                    <Idebanken mode={mode} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/idebanken/:gid"
                element={
                  <ProtectedRoute>
                    <ChecklistItemViewer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/avslutade"
                element={
                  <ProtectedRoute>
                    <Avslutade mode={mode} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/avslutade/:gid"
                element={
                  <ProtectedRoute>
                    <ChecklistItemViewer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/metadata"
                element={
                  <ProtectedRoute>
                    <MetadataPage mode={mode} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/management-plan"
                element={
                  <ProtectedRoute>
                    <ManagementPlanPage mode={mode} />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
