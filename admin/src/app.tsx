import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline, Box } from "@mui/material";
import ChecklistGrid from "./pages/checklist-data-grid";
import Idebanken from "./pages/Idebanken";
import Avslutade from "./pages/Avslutade";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { queryConfig } from "../lib/react-query";

const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

const theme = createTheme({
  palette: {
    mode: "light",
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
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
            <Header />
            <Box sx={{ flexGrow: 1 }}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <ChecklistGrid />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bestallningslistan"
                  element={
                    <ProtectedRoute>
                      <ChecklistGrid />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/idebanken"
                  element={
                    <ProtectedRoute>
                      <Idebanken />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/avslutade"
                  element={
                    <ProtectedRoute>
                      <Avslutade />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </BrowserRouter>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
