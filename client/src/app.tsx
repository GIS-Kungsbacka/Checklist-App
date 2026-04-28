import { useMemo, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";
import FormView from "./pages/FormView";
import OrderSummaryDataGrid from "./pages/orderSummary/orderSummary-data-grid";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Metadata from "./pages/metadata";
import ManagementPlan from "./pages/management-plan";
import { queryConfig } from "../lib/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useBroadcastSync } from "../lib/useBroadcastSync";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

function AppContent() {
  useBroadcastSync();

  const [mode, setMode] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("client-theme-mode");
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
          h3: {
            fontWeight: 700,
          },
          h4: {
            fontWeight: 600,
          },
          h5: {
            fontWeight: 600,
          },
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                overflowY: "scroll",
              },
            },
          },
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
      localStorage.setItem("client-theme-mode", next);
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
          <Box sx={{ flexGrow: 1 }}>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <OrderSummaryDataGrid mode={mode} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checklist/:arendeNummer"
                element={<FormView entity="checklist" />}
              />
              <Route
                path="/metadata/:schemaKey"
                element={<FormView entity="metadata" />}
              />
              <Route
                path="/managementplan/:schemaKey"
                element={<FormView entity="managementplan" />}
              />
              <Route path="/metadata" element={<Metadata mode={mode} />} />
              <Route
                path="/managementplan"
                element={<ManagementPlan mode={mode} />}
              />
            </Routes>
          </Box>
          <Footer />
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
