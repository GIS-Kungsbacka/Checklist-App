import { Container, Typography, Box } from "@mui/material";

export default function Avslutade() {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          avslutade
        </Typography>
        <Typography variant="body1">
          Denna sida är under utveckling.
        </Typography>
      </Box>
    </Container>
  );
}
