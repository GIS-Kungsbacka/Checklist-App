import { Box, Container, Typography, Link } from "@mui/material";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        py: 3,
        backgroundColor: "grey.100",
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {currentYear} Checklist App. All rights reserved.
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            <Link
              href="#"
              color="text.secondary"
              underline="hover"
              sx={{ fontSize: "0.875rem" }}
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              color="text.secondary"
              underline="hover"
              sx={{ fontSize: "0.875rem" }}
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              color="text.secondary"
              underline="hover"
              sx={{ fontSize: "0.875rem" }}
            >
              Contact
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
