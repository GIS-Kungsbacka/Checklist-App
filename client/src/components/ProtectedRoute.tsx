import type { ReactNode } from "react";
import { Container, Box, Typography, Alert } from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Container>
        <Box
          sx={{
            mt: 4,
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <Typography>Laddar...</Typography>
        </Box>
      </Container>
    );
  }

  if (!isAdmin) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            mt: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <LockOutlined sx={{ fontSize: 64, color: "error.main" }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Åtkomst nekad
          </Typography>
          <Alert severity="error" sx={{ width: "100%" }}>
            Du har inte tillgång till denna sida. Kontakta administratören för
            vidare hjälp.
          </Alert>
        </Box>
      </Container>
    );
  }

  return <>{children}</>;
}
