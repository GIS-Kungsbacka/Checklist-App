import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Container,
  Grid,
  Typography,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Description, CalendarToday } from "@mui/icons-material";
import { formsApi } from "../api/formsApi";

export default function FormsList() {
  const { data: forms, isLoading, error } = useQuery({
    queryKey: ["forms"],
    queryFn: formsApi.getAll,
  });

  if (isLoading) {
    return (
      <Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "50vh",
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">
            Failed to load forms. Please try again later.
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          Available Forms
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Browse and access the forms available to you
        </Typography>
      </Box>

      {forms && forms.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No forms available at this time.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {forms?.map((form) => (
            <Grid size={12} key={form.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <Typography variant="h5" component="h2" gutterBottom>
                      {form.name}
                    </Typography>
                    <Chip
                      label={form.isActive ? "Active" : "Inactive"}
                      color={form.isActive ? "success" : "default"}
                      size="small"
                    />
                  </Box>

                  {form.description && (
                    <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                      <Description
                        sx={{ color: "text.secondary", mr: 1, mt: 0.5 }}
                        fontSize="small"
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {form.description}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                    <CalendarToday
                      sx={{ color: "text.secondary", mr: 1 }}
                      fontSize="small"
                    />
                    <Typography variant="caption" color="text.secondary">
                      Created {new Date(form.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Typography variant="caption" color="text.secondary">
                    Created by {form.createdBy}
                  </Typography>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
