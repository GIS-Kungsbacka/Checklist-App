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
  useMediaQuery,
  useTheme,
  Checkbox,
  FormControlLabel,
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
import { useOrders } from "../hooks/useOrders";

type ViewMode = "cards" | "list";

const STORAGE_KEY = "bestallningsspecifikationViewMode";
const STORAGE_KEY_CARD_PAGINATION = "bestallningsspecifikationCardPagination";
const ITEMS_PER_PAGE = 10;
const CARD_ITEMS_PER_PAGE = 8;

export const getPrioritetChipColor = (
  p: string | undefined,
): "error" | "success" | "info" | "default" => {
  if (p === "Hög") return "error";
  if (p === "Medel") return "success";
  if (p === "Låg") return "info";
  return "default";
};

const getInitialViewMode = (): ViewMode => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "cards" || saved === "list") return saved;
  } catch {
    // ignore
  }
  return "cards";
};

const getInitialCardPagination = (): boolean => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CARD_PAGINATION);
    if (saved === "true") return true;
    if (saved === "false") return false;
  } catch {
    // ignore
  }
  return false;
};

export default function FormsList() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDownMd = useMediaQuery(theme.breakpoints.down("md"));
  const isDownSm = useMediaQuery(theme.breakpoints.down("sm"));
  const [viewMode, setViewMode] = useState<ViewMode>(getInitialViewMode);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [cardPaginationEnabled, setCardPaginationEnabled] = useState(
    getInitialCardPagination,
  );

  const { data: items = [], isLoading, error } = useOrders();

  const filteredItems = useMemo(() => {
    let result = items;
    // Filter by search query if provided
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = items.filter(
        (item) =>
          item.arendenummerArtvise?.toLowerCase().includes(q) ||
          item.beskrivning?.toLowerCase().includes(q) ||
          item.bestallareOrganisation?.toLowerCase().includes(q) ||
          item.dataadministrator?.toLowerCase().includes(q) ||
          item.kategori?.toLowerCase().includes(q) ||
          item.arendenummerArtvise?.toString().includes(q),
      );
    }

    return [...result].sort((a, b) =>
      (a.arendenummerArtvise as string).localeCompare(
        b.arendenummerArtvise as string,
      ),
    );
  }, [items, searchQuery]);

  const paginatedItems = useMemo(() => {
    return filteredItems.slice(
      (page - 1) * ITEMS_PER_PAGE,
      page * ITEMS_PER_PAGE,
    );
  }, [filteredItems, page]);

  const cardItems = useMemo(() => {
    if (cardPaginationEnabled && viewMode === "cards") {
      const start = (page - 1) * CARD_ITEMS_PER_PAGE;
      return filteredItems.slice(start, start + CARD_ITEMS_PER_PAGE);
    }
    return filteredItems;
  }, [filteredItems, page, cardPaginationEnabled, viewMode]);

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1;
  const cardTotalPages =
    Math.ceil(filteredItems.length / CARD_ITEMS_PER_PAGE) || 1;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, viewMode);
    } catch {
      // ignore
    }
  }, [viewMode]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_CARD_PAGINATION,
        String(cardPaginationEnabled),
      );
    } catch {
      // ignore
    }
  }, [cardPaginationEnabled]);

  const handleViewModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    newMode: ViewMode | null,
  ) => {
    if (newMode !== null) setViewMode(newMode);
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
            {error instanceof Error
              ? error.message
              : "Kunde inte ladda beställningsspecifikationer. Försök igen senare."}
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
        minHeight: viewMode === "cards" ? "calc(100vh - 180px)" : "auto",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          mt: 4,
          mb: 6,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
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
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              Varje objekt visar en sammanfattning av
              beställningsspecifikationen. Klicka på objektet för att se fler
              detaljer.
            </Typography>
          </Box>
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            flexWrap="wrap"
          >
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
                    "&:hover": { backgroundColor: "primary.dark" },
                  },
                },
              }}
            >
              <Tooltip title="Kortvy" arrow>
                <ToggleButton value="cards" aria-label="card view">
                  <ViewModule />
                </ToggleButton>
              </Tooltip>
              <Tooltip title="Listvy" arrow>
                <ToggleButton value="list" aria-label="list view">
                  <ViewList />
                </ToggleButton>
              </Tooltip>
            </ToggleButtonGroup>
            {viewMode === "cards" &&
              filteredItems.length > CARD_ITEMS_PER_PAGE && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={cardPaginationEnabled}
                      onChange={(e) => {
                        setCardPaginationEnabled(e.target.checked);
                        setPage(1);
                      }}
                      size="small"
                    />
                  }
                  label="Paginering i kortvy"
                />
              )}
          </Stack>
        </Box>

        <Box mb={3}>
          <TextField
            fullWidth
            placeholder="Sök på ärendenummer, beskrivning, beställare, dataadministratör, kategori eller ärendenummerArtvise..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
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
              Visar {filteredItems.length} av {items.length} poster
            </Typography>
          )}
        </Box>

        {filteredItems.length === 0 ? (
          <Card elevation={2}>
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {searchQuery
                  ? "Inga poster matchar sökningen"
                  : "Inga beställningsspecifikationer tillgängliga."}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchQuery
                  ? "Justera sökningen"
                  : "Kontakta administratören."}
              </Typography>
            </Box>
          </Card>
        ) : viewMode === "cards" ? (
          <>
            <Paper
              elevation={3}
              sx={{ p: 2, borderRadius: 2, flexGrow: 1, overflow: "auto" }}
            >
              <Grid container spacing={2}>
                {cardItems.map((item) => (
                  <Grid size={3} key={item.arendenummerArtvise}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        cursor: "pointer",
                        border: "1px solid",
                        borderColor: "divider",
                        "&:hover": {
                          borderColor: "primary.main",
                          boxShadow: 4,
                        },
                      }}
                      onClick={() =>
                        navigate(`/form/${item.arendenummerArtvise}`)
                      }
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
                          <Chip
                            label={`Ärendenummer Artvise ${item.arendenummerArtvise}`}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                        {item.beskrivning && (
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
                              {item.beskrivning}
                            </Typography>
                          </Box>
                        )}
                        <Stack spacing={0.75} sx={{ mt: 1.5 }}>
                          {item.bestallareOrganisation && (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Person
                                sx={{ color: "text.secondary", mr: 1 }}
                                fontSize="small"
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {item.bestallareOrganisation}
                              </Typography>
                            </Box>
                          )}
                          {item.datumInkommet && (
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <CalendarToday
                                sx={{ color: "text.secondary", mr: 1 }}
                                fontSize="small"
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {item.datumInkommet}
                              </Typography>
                            </Box>
                          )}
                          {item.kategori && (
                            <Chip
                              label={item.kategori}
                              size="small"
                              sx={{ alignSelf: "flex-start" }}
                            />
                          )}
                          {item.prioritet && (
                            <Chip
                              label={item.prioritet}
                              size="small"
                              color={getPrioritetChipColor(item.prioritet)}
                              variant="filled"
                              sx={{ alignSelf: "flex-start" }}
                            />
                          )}
                        </Stack>
                      </CardContent>
                      <CardActions
                        sx={{ p: 1.5, pt: 0, justifyContent: "flex-end" }}
                      >
                        <Button
                          endIcon={<ArrowForward />}
                          variant="contained"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/form/${item.arendenummerArtvise}`);
                          }}
                        >
                          Visa detaljer
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Paper>
            {viewMode === "cards" &&
              cardPaginationEnabled &&
              filteredItems.length > CARD_ITEMS_PER_PAGE && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 4,
                    mb: 2,
                  }}
                >
                  <Pagination
                    count={cardTotalPages}
                    page={page}
                    onChange={(_e, value) => setPage(value)}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}
          </>
        ) : (
          <>
            <TableContainer
              component={Paper}
              elevation={2}
              sx={{
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                overflow: "hidden",
                overflowX: "auto",
              }}
            >
              <Table
                size={isDownSm ? "small" : "medium"}
                sx={{ minWidth: isDownMd ? 640 : 760 }}
              >
                <TableHead>
                  <TableRow sx={{ backgroundColor: "grey.100" }}>
                    <TableCell
                      sx={{ fontWeight: 700, py: 1.5, whiteSpace: "nowrap" }}
                    >
                      Ärendenummer
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 700, py: 1.5, whiteSpace: "nowrap" }}
                    >
                      Beställare
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 700, py: 1.5, whiteSpace: "nowrap" }}
                    >
                      Datum inkommet
                    </TableCell>
                    {!isDownSm && (
                      <TableCell
                        sx={{ fontWeight: 700, py: 1.5, whiteSpace: "nowrap" }}
                      >
                        Kategori
                      </TableCell>
                    )}
                    {!isDownSm && (
                      <TableCell
                        sx={{ fontWeight: 700, py: 1.5, whiteSpace: "nowrap" }}
                      >
                        Prioritet
                      </TableCell>
                    )}
                    <TableCell align="right" sx={{ fontWeight: 700, py: 1.5 }}>
                      Åtgärd
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedItems.map((item) => (
                    <TableRow
                      key={item.arendenummerArtvise}
                      sx={{
                        cursor: "pointer",
                        "& td": { py: 1.25 },
                        "&:hover": { backgroundColor: "action.hover" },
                      }}
                      onClick={() =>
                        navigate(`/form/${item.arendenummerArtvise}`)
                      }
                    >
                      <TableCell sx={{ fontWeight: 500 }}>
                        {item.arendenummerArtvise ?? "-"}
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <Person
                            sx={{ fontSize: 16, color: "text.secondary" }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {item.bestallareOrganisation ?? "-"}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <CalendarToday
                            sx={{ fontSize: 16, color: "text.secondary" }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {item.datumInkommet ?? "-"}
                          </Typography>
                        </Box>
                      </TableCell>
                      {!isDownSm && (
                        <TableCell>{item.kategori ?? "-"}</TableCell>
                      )}
                      {!isDownSm && (
                        <TableCell>
                          {item.prioritet ? (
                            <Chip
                              label={item.prioritet}
                              size="small"
                              color={getPrioritetChipColor(item.prioritet)}
                              variant="filled"
                            />
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      )}
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/form/${item.arendenummerArtvise}`);
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
            {filteredItems.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 5.5,
                  mb: 2,
                }}
              >
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_e, value) => setPage(value)}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}
