import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [openInfo, setOpenInfo] = useState(false);
  const [openContact, setOpenContact] = useState(false);

  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        py: 3,
        backgroundColor: "background.paper",
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
            © {currentYear} Geodataavdelningen
          </Typography>
          <Box sx={{ display: "flex", gap: 4 }}>
            <Link
              component="button"
              onClick={() => setOpenInfo(true)}
              color="text.secondary"
              underline="hover"
              sx={{ fontSize: "0.875rem" }}
            >
              Information
            </Link>

            <Link
              component="button"
              onClick={() => setOpenContact(true)}
              color="text.secondary"
              underline="hover"
              sx={{ fontSize: "0.875rem" }}
            >
              Kontakt
            </Link>
          </Box>
        </Box>
      </Container>
      <Dialog open={openInfo} onClose={() => setOpenInfo(false)}>
        <DialogTitle>Information (under utveckling)</DialogTitle>
        <DialogContent>
          <Typography>
            Här kan du läsa mer om våra tjänster och våra verktyg.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInfo(false)}>Stäng</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openContact} onClose={() => setOpenContact(false)}>
        <DialogTitle>Kontakt (under utveckling)</DialogTitle>
        <DialogContent>
          <Typography>Behöver du hjälp?</Typography>
          <Typography>
            Skicka in ett ärende till oss:{" "}
            <a href="https://example.com">Artvise</a>
          </Typography>
          <br />
          <Typography>
            E-mail: <a href="mailto:contact@example.com">contact@example.com</a>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenContact(false)}>Stäng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
