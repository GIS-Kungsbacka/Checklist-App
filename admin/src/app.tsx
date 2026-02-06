import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import FormsList from "./pages/FormsList";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const theme = createTheme({
  palette: {
    mode: "light",
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter basename="/admin">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <FormsList />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
