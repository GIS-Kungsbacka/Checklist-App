import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
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
  Button,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Pagination,
} from "@mui/material";
import {
  Description,
  CalendarToday,
  ArrowForward,
  Person,
  ViewModule,
  ViewList,
  Search,
} from "@mui/icons-material";
import { formsApi } from "../api/formsApi";

type ViewMode = "cards" | "list";

const STORAGE_KEY = "formsViewMode";
const ITEMS_PER_PAGE = 10; // 10 items for cards (2 columns x 5 rows), works well for list too

// Helper function to get initial view mode from localStorage
const getInitialViewMode = (): ViewMode => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "cards" || saved === "list") {
      return saved;
    }
  } catch (error) {
    console.error("Failed to read view mode from localStorage:", error);
  }
  return "cards"; // Default to cards view
};

export default function FormsList() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>(getInitialViewMode);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const {
    data: forms,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["forms"],
    queryFn: formsApi.getAll,
  });

  // Filter to show only active forms
  const activeForms = useMemo(() => {
    return forms?.filter((form) => form.isActive) || [];
  }, [forms]);

  // Filter forms based on search query
  const filteredForms = useMemo(() => {
    if (!searchQuery.trim()) return activeForms;
    const query = searchQuery.toLowerCase().trim();
    return activeForms.filter(
      (form) =>
        form.name.toLowerCase().includes(query) ||
        form.description?.toLowerCase().includes(query) ||
        form.createdBy.toLowerCase().includes(query),
    );
  }, [activeForms, searchQuery]);

  // Paginate filtered forms
  const paginatedForms = useMemo(() => {
    return filteredForms.slice(
      (page - 1) * ITEMS_PER_PAGE,
      page * ITEMS_PER_PAGE,
    );
  }, [filteredForms, page]);

  const totalPages = Math.ceil(filteredForms.length / ITEMS_PER_PAGE);

  // Reset to page 1 when search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  // Save view mode to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, viewMode);
    } catch (error) {
      console.error("Failed to save view mode to localStorage:", error);
    }
  }, [viewMode]);

  const handleViewModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newViewMode: ViewMode | null,
  ) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            Failed to load forms. Please try again later.
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: viewMode === "cards" ? "calc(100vh - 180px)" : "auto",
        minHeight: viewMode === "cards" ? "calc(100vh - 180px)" : "auto",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          mt: 4,
          mb: 6,
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          minHeight: 1,
        }}
      >
        <Box
          mb={4}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              fontWeight={700}
            >
              Available Forms
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Browse and access the forms available to you
            </Typography>
          </Box>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="view mode"
            size="small"
            sx={{
              "& .MuiToggleButton-root": {
                border: "1px solid",
                borderColor: "divider",
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                },
              },
            }}
          >
            <Tooltip title="Card View" arrow>
              <ToggleButton value="cards" aria-label="card view">
                <ViewModule />
              </ToggleButton>
            </Tooltip>
            <Tooltip title="List View" arrow>
              <ToggleButton value="list" aria-label="list view">
                <ViewList />
              </ToggleButton>
            </Tooltip>
          </ToggleButtonGroup>
        </Box>

        {/* Search Bar */}
        <Box mb={3}>
          <TextField
            fullWidth
            placeholder="Search forms by name, description, or creator..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search color="action" />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "background.paper",
              },
            }}
          />
          {searchQuery && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 1, display: "block" }}
            >
              Showing {filteredForms.length} of {activeForms.length} forms
            </Typography>
          )}
        </Box>

        {filteredForms.length === 0 ? (
          <Card elevation={2}>
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {searchQuery
                  ? "No forms match your search"
                  : "No forms available at this time."}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Please check back later or contact your administrator."}
              </Typography>
            </Box>
          </Card>
        ) : viewMode === "cards" ? (
          <>
            <Box
              sx={{
                flexGrow: 1,
                overflowY: "auto",
                overflowX: "hidden",
                p: 2,
                mb: 2,
                "&::-webkit-scrollbar": {
                  width: "8px",
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "grey.100",
                  borderRadius: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "grey.400",
                  borderRadius: "4px",
                  "&:hover": {
                    backgroundColor: "grey.500",
                  },
                },
              }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "background.paper",
                }}
              >
                <Grid container spacing={2}>
                  {paginatedForms.map((form) => (
                    <Grid size={6} key={form.id}>
                      <Card
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          cursor: "pointer",
                          border: "1px solid",
                          borderColor: "divider",
                          boxShadow: 1,
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: 4,
                            borderColor: "primary.main",
                          },
                        }}
                        onClick={() => navigate(`/form/${form.id}`)}
                      >
                        <CardContent sx={{ flexGrow: 1, p: 2 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              justifyContent: "space-between",
                              mb: 2,
                            }}
                          >
                            <Typography
                              variant="h6"
                              component="h2"
                              fontWeight={600}
                              sx={{
                                flex: 1,
                                pr: 1,
                                fontSize: "1.1rem",
                              }}
                            >
                              {form.name}
                            </Typography>
                            <Chip
                              label="Active"
                              color="success"
                              size="small"
                              sx={{ flexShrink: 0 }}
                            />
                          </Box>

                          {form.description && (
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                mb: 1.5,
                                minHeight: 50,
                              }}
                            >
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
                                  flex: 1,
                                }}
                              >
                                {form.description}
                              </Typography>
                            </Box>
                          )}

                          <Stack spacing={0.75} sx={{ mt: 1.5 }}>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <CalendarToday
                                sx={{ color: "text.secondary", mr: 1 }}
                                fontSize="small"
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Created{" "}
                                {new Date(form.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Person
                                sx={{ color: "text.secondary", mr: 1 }}
                                fontSize="small"
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {form.createdBy}
                              </Typography>
                            </Box>
                          </Stack>
                        </CardContent>
                        <CardActions
                          sx={{ p: 1.5, pt: 0, justifyContent: "flex-end" }}
                        >
                          <Button
                            endIcon={<ArrowForward />}
                            variant="contained"
                            size="small"
                            sx={{ fontSize: "0.75rem", py: 0.5 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/form/${form.id}`);
                            }}
                          >
                            Open Form
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Box>
            {/* Pagination for Cards */}
            {totalPages > 1 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mt: 4,
                  mb: 2,
                }}
              >
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_event, value) => setPage(value)}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </>
        ) : (
          <TableContainer
            component={Paper}
            elevation={2}
            sx={{ borderRadius: 2 }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "grey.50" }}>
                  <TableCell sx={{ fontWeight: 600, width: "30%" }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, width: "35%" }}>
                    Description
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, width: "15%" }}>
                    Created By
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, width: "15%" }}>
                    Created Date
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, width: "5%" }}
                    align="right"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedForms.map((form) => (
                  <TableRow
                    key={form.id}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "action.hover",
                      },
                    }}
                    onClick={() => navigate(`/form/${form.id}`)}
                  >
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Typography variant="body2" fontWeight={500}>
                          {form.name}
                        </Typography>
                        <Chip
                          label="Active"
                          color="success"
                          size="small"
                          sx={{ height: 20, fontSize: "0.65rem" }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: 400,
                        }}
                      >
                        {form.description || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <Person
                          sx={{ fontSize: 16, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {form.createdBy}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                      >
                        <CalendarToday
                          sx={{ fontSize: 16, color: "text.secondary" }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          {new Date(form.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/form/${form.id}`);
                        }}
                        sx={{
                          "&:hover": {
                            backgroundColor: "primary.light",
                            color: "white",
                          },
                        }}
                      >
                        <ArrowForward fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Pagination for List View */}
        {viewMode === "list" && filteredForms.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 4,
              mb: 2,
            }}
          >
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_event, value) => setPage(value)}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}
