// import { useNavigate } from "react-router-dom";
// import { useState, useEffect, useMemo } from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   CardActions,
//   Container,
//   Grid,
//   Typography,
//   Chip,
//   CircularProgress,
//   Alert,
//   Button,
//   Stack,
//   ToggleButton,
//   ToggleButtonGroup,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   IconButton,
//   Tooltip,
//   TextField,
//   InputAdornment,
//   Pagination,
//   useMediaQuery,
//   useTheme,
//   Checkbox,
//   FormControlLabel,
//   Popover,
//   Badge,
//   Divider,
//   keyframes,
// } from "@mui/material";
// import {
//   Description,
//   CalendarToday,
//   ArrowForward,
//   Person,
//   ViewModule,
//   ViewList,
//   Search,
//   FilterList,
// } from "@mui/icons-material";
// import { useOrders } from "../hooks/useOrders";

// type ViewMode = "cards" | "list";

// const STORAGE_KEY = "bestallningsspecifikationViewMode";
// const STORAGE_KEY_CARD_PAGINATION = "bestallningsspecifikationCardPagination";
// const ITEMS_PER_PAGE = 10;
// const CARD_ITEMS_PER_PAGE = 8;

// const PRIORITET_OPTIONS = ["Hög", "Medel", "Låg"] as const;

// const FILTER_COLUMNS = [
//   { key: "prioritet", label: "Prioritet", options: [...PRIORITET_OPTIONS] },
// ] as const;

// export const getPrioritetChipColor = (
//   p: string | undefined
// ): "error" | "success" | "info" | "default" => {
//   if (p === "Hög") return "error";
//   if (p === "Medel") return "success";
//   if (p === "Låg") return "info";
//   return "default";
// };

// const getInitialViewMode = (): ViewMode => {
//   try {
//     const saved = localStorage.getItem(STORAGE_KEY);
//     if (saved === "cards" || saved === "list") return saved;
//   } catch {
//     // ignore
//   }
//   return "cards";
// };

// const getInitialCardPagination = (): boolean => {
//   try {
//     const saved = localStorage.getItem(STORAGE_KEY_CARD_PAGINATION);
//     if (saved === "true") return true;
//     if (saved === "false") return false;
//   } catch {
//     // ignore
//   }
//   return true;
// };

// export default function FormsList() {
//   const navigate = useNavigate();
//   const theme = useTheme();
//   const isDownMd = useMediaQuery(theme.breakpoints.down("md"));
//   const isDownSm = useMediaQuery(theme.breakpoints.down("sm"));
//   const [viewMode, setViewMode] = useState<ViewMode>(getInitialViewMode);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [page, setPage] = useState(1);
//   const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null);
//   const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>(
//     {}
//   );
//   const [datumSortOrder, setDatumSortOrder] = useState<"asc" | "desc" | null>(
//     null
//   );
//   const [cardPaginationEnabled, setCardPaginationEnabled] = useState(
//     getInitialCardPagination
//   );

//   const {
//     data: items = [],
//     isLoading,
//     isError,
//     failureCount,
//     isRefetchError,
//   } = useOrders();

//   const uniqueValues = useMemo(() => {
//     const map: Record<string, string[]> = {};
//     for (const col of FILTER_COLUMNS) {
//       if ("options" in col && col.options) {
//         map[col.key] = [...col.options];
//       } else {
//         const seen = new Set<string>();
//         for (const item of items) {
//           const v = (item as unknown as Record<string, unknown>)[col.key];
//           if (v != null && String(v).trim()) seen.add(String(v).trim());
//         }
//         map[col.key] = [...seen].sort((a, b) => a.localeCompare(b));
//       }
//     }
//     return map;
//   }, [items]);

//   const activeFilterCount =
//     Object.values(columnFilters).reduce(
//       (sum, arr) => sum + (arr?.length ?? 0),
//       0
//     ) + (datumSortOrder ? 1 : 0);

//   const filteredItems = useMemo(() => {
//     let result = items;
//     if (searchQuery.trim()) {
//       const q = searchQuery.toLowerCase().trim();
//       result = result.filter(
//         (item) =>
//           item.arendenummerArtvise?.toLowerCase().includes(q) ||
//           item.beskrivning?.toLowerCase().includes(q) ||
//           item.bestallareOrganisation?.toLowerCase().includes(q) ||
//           item.dataadministrator?.toLowerCase().includes(q) ||
//           item.kategori?.toLowerCase().includes(q) ||
//           item.arendenummerArtvise?.toString().includes(q)
//       );
//     }

//     for (const col of FILTER_COLUMNS) {
//       const selected = columnFilters[col.key];
//       if (!selected?.length) continue;
//       const set = new Set(selected);
//       result = result.filter((item) => {
//         const v = (item as unknown as Record<string, unknown>)[col.key];
//         const str = v != null ? String(v).trim() : "";
//         return str && set.has(str);
//       });
//     }

//     const sorted = [...result];
//     if (datumSortOrder) {
//       sorted.sort((a, b) => {
//         const da = a.datumInkommet || "";
//         const db = b.datumInkommet || "";
//         const cmp = da.localeCompare(db);
//         return datumSortOrder === "asc" ? cmp : -cmp;
//       });
//     } else {
//       sorted.sort((a, b) =>
//         (a.arendenummerArtvise as string).localeCompare(
//           b.arendenummerArtvise as string
//         )
//       );
//     }
//     return sorted;
//   }, [items, searchQuery, columnFilters, datumSortOrder]);

//   const handleFilterToggle = (colKey: string, value: string) => {
//     setPage(1);
//     setColumnFilters((prev) => {
//       const arr = prev[colKey] ?? [];
//       const next = arr.includes(value)
//         ? arr.filter((x) => x !== value)
//         : [...arr, value];
//       const copy = { ...prev };
//       if (next.length) copy[colKey] = next;
//       else delete copy[colKey];
//       return copy;
//     });
//   };

//   const handleClearFilters = () => {
//     setColumnFilters({});
//     setDatumSortOrder(null);
//     setPage(1);
//   };

//   const handleDatumSortToggle = (order: "asc" | "desc") => {
//     setPage(1);
//     setDatumSortOrder((prev) => (prev === order ? null : order));
//   };

//   const paginatedItems = useMemo(() => {
//     return filteredItems.slice(
//       (page - 1) * ITEMS_PER_PAGE,
//       page * ITEMS_PER_PAGE
//     );
//   }, [filteredItems, page]);

//   const cardItems = useMemo(() => {
//     if (cardPaginationEnabled && viewMode === "cards") {
//       const start = (page - 1) * CARD_ITEMS_PER_PAGE;
//       return filteredItems.slice(start, start + CARD_ITEMS_PER_PAGE);
//     }
//     return filteredItems;
//   }, [filteredItems, page, cardPaginationEnabled, viewMode]);

//   const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1;
//   const cardTotalPages =
//     Math.ceil(filteredItems.length / CARD_ITEMS_PER_PAGE) || 1;

//   useEffect(() => {
//     try {
//       localStorage.setItem(STORAGE_KEY, viewMode);
//     } catch {
//       // ignore
//     }
//   }, [viewMode]);

//   useEffect(() => {
//     try {
//       localStorage.setItem(
//         STORAGE_KEY_CARD_PAGINATION,
//         String(cardPaginationEnabled)
//       );
//     } catch {
//       // ignore
//     }
//   }, [cardPaginationEnabled]);

//   const handleViewModeChange = (
//     _event: React.MouseEvent<HTMLElement>,
//     newMode: ViewMode | null
//   ) => {
//     if (newMode !== null) setViewMode(newMode);
//   };

//   if (isLoading) {
//     return (
//       <Container maxWidth="lg">
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             minHeight: "60vh",
//           }}
//         >
//           <CircularProgress size={60} />
//         </Box>
//       </Container>
//     );
//   }

//   const showApiDown = failureCount > 0 || isRefetchError || isError;
//   const dots = keyframes`
//   0% { content: ""; }
//   33% { content: "."; }
//   66% { content: ".."; }
//   100% { content: "..."; }
// `;
//   if (showApiDown) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           minHeight: "60vh",
//         }}
//       >
//         <Alert severity="error" sx={{ mb: 2 }}>
//           Kunde inte ladda listan. Försöker igen
//           <Box
//             component="span"
//             sx={{
//               "&::after": {
//                 content: '""',
//                 animation: `${dots} 1.5s steps(3, end) infinite`,
//               },
//             }}
//           />
//         </Alert>
//       </Box>
//     );
//   }

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         minHeight: viewMode === "cards" ? "calc(100vh - 180px)" : "auto",
//       }}
//     >
//       <Container
//         maxWidth="xl"
//         sx={{
//           mt: 4,
//           mb: 6,
//           flexGrow: 1,
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         <Box
//           mb={4}
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "flex-start",
//             flexWrap: "wrap",
//             gap: 2,
//           }}
//         >
//           <Box>
//             <Typography variant="body1" sx={{ fontWeight: 600 }}>
//               Sammanfattning av beställningsspecifikationer.
//             </Typography>
//             <Typography variant="body2">
//               Klicka på objektet i listan för att se fler detaljer.
//             </Typography>
//           </Box>
//           <Stack
//             direction="row"
//             alignItems="center"
//             spacing={2}
//             flexWrap="wrap"
//           >
//             <ToggleButtonGroup
//               value={viewMode}
//               exclusive
//               onChange={handleViewModeChange}
//               aria-label="view mode"
//               size="small"
//               sx={{
//                 "& .MuiToggleButton-root": {
//                   border: "1px solid",
//                   borderColor: "divider",
//                   "&.Mui-selected": {
//                     backgroundColor: "primary.main",
//                     color: "white",
//                     "&:hover": { backgroundColor: "primary.dark" },
//                   },
//                 },
//               }}
//             >
//               <Tooltip title="Kortvy" arrow>
//                 <ToggleButton value="cards" aria-label="card view">
//                   <ViewModule />
//                 </ToggleButton>
//               </Tooltip>
//               <Tooltip title="Listvy" arrow>
//                 <ToggleButton value="list" aria-label="list view">
//                   <ViewList />
//                 </ToggleButton>
//               </Tooltip>
//             </ToggleButtonGroup>
//             {viewMode === "cards" &&
//               filteredItems.length > CARD_ITEMS_PER_PAGE && (
//                 <FormControlLabel
//                   control={
//                     <Checkbox
//                       checked={cardPaginationEnabled}
//                       onChange={(e) => {
//                         setCardPaginationEnabled(e.target.checked);
//                         setPage(1);
//                       }}
//                       size="small"
//                     />
//                   }
//                   label="Paginering i kortvy"
//                 />
//               )}
//           </Stack>
//         </Box>

//         <Box mb={3} display="flex" flexDirection="column" gap={1}>
//           <Box display="flex" gap={1} alignItems="flex-start">
//             <TextField
//               fullWidth
//               placeholder="Sök på ärendenummer, beskrivning, beställare, dataadministratör, eller kategori..."
//               value={searchQuery}
//               onChange={(e) => {
//                 setSearchQuery(e.target.value);
//                 setPage(1);
//               }}
//               slotProps={{
//                 input: {
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <Search color="action" />
//                     </InputAdornment>
//                   ),
//                 },
//               }}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   backgroundColor: "background.paper",
//                 },
//               }}
//             />
//             <Tooltip title="Filtrera">
//               <IconButton
//                 onClick={(e) => setFilterAnchor(e.currentTarget)}
//                 sx={{
//                   mt: 0.5,
//                   backgroundColor: "background.paper",
//                   border: "1px solid",
//                   borderColor: "divider",
//                   "&:hover": {
//                     backgroundColor: "action.hover",
//                   },
//                 }}
//                 aria-label="Öppna filter"
//               >
//                 <Badge badgeContent={activeFilterCount} color="primary">
//                   <FilterList />
//                 </Badge>
//               </IconButton>
//             </Tooltip>
//           </Box>
//           {(searchQuery || activeFilterCount > 0) && (
//             <Typography
//               variant="caption"
//               color="text.secondary"
//               sx={{ mt: 1, display: "block" }}
//             >
//               Visar {filteredItems.length} av {items.length} poster
//             </Typography>
//           )}
//         </Box>
//         <Popover
//           open={!!filterAnchor}
//           anchorEl={filterAnchor}
//           onClose={() => setFilterAnchor(null)}
//           anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//           transformOrigin={{ vertical: "top", horizontal: "right" }}
//           slotProps={{
//             paper: {
//               sx: {
//                 mt: 1.5,
//                 minWidth: 320,
//                 maxWidth: 360,
//                 maxHeight: 420,
//                 borderRadius: 2,
//                 boxShadow: 4,
//                 overflow: "hidden",
//               },
//             },
//           }}
//         >
//           <Box sx={{ p: 2, pb: 1 }}>
//             <Stack
//               direction="row"
//               justifyContent="space-between"
//               alignItems="center"
//               mb={2}
//             >
//               <Typography variant="subtitle1" fontWeight={600}>
//                 Filter
//               </Typography>
//               {activeFilterCount > 0 && (
//                 <Button
//                   size="small"
//                   onClick={handleClearFilters}
//                   sx={{ textTransform: "none" }}
//                 >
//                   Rensa alla
//                 </Button>
//               )}
//             </Stack>
//             <Divider sx={{ mb: 2 }} />
//             <Stack spacing={2} sx={{ maxHeight: 320, overflowY: "auto" }}>
//               {FILTER_COLUMNS.map((col) => {
//                 const values = uniqueValues[col.key] ?? [];
//                 if (values.length === 0) return null;
//                 const selected = columnFilters[col.key] ?? [];
//                 return (
//                   <Box key={col.key}>
//                     <Typography
//                       variant="caption"
//                       fontWeight={600}
//                       color="text.secondary"
//                       sx={{
//                         display: "block",
//                         mb: 1,
//                         textTransform: "uppercase",
//                       }}
//                     >
//                       {col.label}
//                     </Typography>
//                     <Stack
//                       direction="row"
//                       flexWrap="wrap"
//                       useFlexGap
//                       spacing={0.5}
//                     >
//                       {values.slice(0, 12).map((val) => (
//                         <Chip
//                           key={val}
//                           label={val}
//                           size="small"
//                           variant={
//                             selected.includes(val) ? "filled" : "outlined"
//                           }
//                           onClick={() => handleFilterToggle(col.key, val)}
//                           sx={{
//                             cursor: "pointer",
//                             "&.MuiChip-filled": {
//                               backgroundColor: "primary.main",
//                               color: "primary.contrastText",
//                             },
//                           }}
//                         />
//                       ))}
//                       {values.length > 12 && (
//                         <Typography
//                           variant="caption"
//                           color="text.secondary"
//                           sx={{ alignSelf: "center", ml: 0.5 }}
//                         >
//                           +{values.length - 12} fler
//                         </Typography>
//                       )}
//                     </Stack>
//                   </Box>
//                 );
//               })}
//               <Box>
//                 <Typography
//                   variant="caption"
//                   fontWeight={600}
//                   color="text.secondary"
//                   sx={{
//                     display: "block",
//                     mb: 1,
//                     textTransform: "uppercase",
//                   }}
//                 >
//                   Datum inkommet
//                 </Typography>
//                 <Stack direction="row" flexWrap="wrap" useFlexGap spacing={0.5}>
//                   <Chip
//                     label="Stigande"
//                     size="small"
//                     variant={datumSortOrder === "asc" ? "filled" : "outlined"}
//                     onClick={() => handleDatumSortToggle("asc")}
//                     sx={{
//                       cursor: "pointer",
//                       "&.MuiChip-filled": {
//                         backgroundColor: "primary.main",
//                         color: "primary.contrastText",
//                       },
//                     }}
//                   />
//                   <Chip
//                     label="Fallande"
//                     size="small"
//                     variant={datumSortOrder === "desc" ? "filled" : "outlined"}
//                     onClick={() => handleDatumSortToggle("desc")}
//                     sx={{
//                       cursor: "pointer",
//                       "&.MuiChip-filled": {
//                         backgroundColor: "primary.main",
//                         color: "primary.contrastText",
//                       },
//                     }}
//                   />
//                 </Stack>
//               </Box>
//             </Stack>
//           </Box>
//         </Popover>

//         {filteredItems.length === 0 ? (
//           <Card elevation={2}>
//             <Box sx={{ textAlign: "center", py: 8 }}>
//               <Typography variant="h6" color="text.secondary" gutterBottom>
//                 {searchQuery || activeFilterCount > 0
//                   ? "Inga poster matchar sökningen eller filtren"
//                   : "Inga beställningsspecifikationer tillgängliga."}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 {searchQuery || activeFilterCount > 0
//                   ? "Justera sökningen eller filtren"
//                   : "Kontakta administratören."}
//               </Typography>
//             </Box>
//           </Card>
//         ) : viewMode === "cards" ? (
//           <>
//             <Paper
//               elevation={3}
//               sx={{ p: 2, borderRadius: 2, flexGrow: 1, overflow: "auto" }}
//             >
//               <Grid container spacing={2}>
//                 {cardItems.map((item) => (
//                   <Grid size={3} key={item.arendenummerArtvise}>
//                     <Card
//                       sx={{
//                         height: "100%",
//                         display: "flex",
//                         flexDirection: "column",
//                         cursor: "pointer",
//                         border: "1px solid",
//                         borderColor: "divider",
//                         "&:hover": {
//                           borderColor: "primary.main",
//                           boxShadow: 4,
//                         },
//                       }}
//                       onClick={() =>
//                         navigate(`/form/${item.arendenummerArtvise}`)
//                       }
//                     >
//                       <CardContent sx={{ flexGrow: 1, p: 2 }}>
//                         <Box
//                           sx={{
//                             display: "flex",
//                             alignItems: "flex-start",
//                             justifyContent: "space-between",
//                             mb: 2,
//                           }}
//                         >
//                           <Chip
//                             label={`Ärendenummer Artvise ${item.arendenummerArtvise}`}
//                             size="small"
//                             variant="outlined"
//                           />
//                         </Box>
//                         {item.beskrivning && (
//                           <Box
//                             sx={{
//                               display: "flex",
//                               alignItems: "flex-start",
//                               mb: 1.5,
//                               minHeight: 50,
//                             }}
//                           >
//                             <Description
//                               sx={{ color: "text.secondary", mr: 1, mt: 0.5 }}
//                               fontSize="small"
//                             />
//                             <Typography
//                               variant="body2"
//                               color="text.secondary"
//                               sx={{
//                                 display: "-webkit-box",
//                                 WebkitLineClamp: 3,
//                                 WebkitBoxOrient: "vertical",
//                                 overflow: "hidden",
//                                 flex: 1,
//                               }}
//                             >
//                               {item.beskrivning}
//                             </Typography>
//                           </Box>
//                         )}
//                         <Stack spacing={0.75} sx={{ mt: 1.5 }}>
//                           {item.bestallareOrganisation && (
//                             <Box sx={{ display: "flex", alignItems: "center" }}>
//                               <Person
//                                 sx={{ color: "text.secondary", mr: 1 }}
//                                 fontSize="small"
//                               />
//                               <Typography
//                                 variant="caption"
//                                 color="text.secondary"
//                               >
//                                 {item.bestallareOrganisation}
//                               </Typography>
//                             </Box>
//                           )}
//                           {item.datumInkommet && (
//                             <Box sx={{ display: "flex", alignItems: "center" }}>
//                               <CalendarToday
//                                 sx={{ color: "text.secondary", mr: 1 }}
//                                 fontSize="small"
//                               />
//                               <Typography
//                                 variant="caption"
//                                 color="text.secondary"
//                               >
//                                 {item.datumInkommet}
//                               </Typography>
//                             </Box>
//                           )}
//                           {item.kategori && (
//                             <Chip
//                               label={item.kategori}
//                               size="small"
//                               sx={{ alignSelf: "flex-start" }}
//                             />
//                           )}
//                           {item.prioritet && (
//                             <Chip
//                               label={item.prioritet}
//                               size="small"
//                               color={getPrioritetChipColor(item.prioritet)}
//                               variant="filled"
//                               sx={{ alignSelf: "flex-start" }}
//                             />
//                           )}
//                         </Stack>
//                       </CardContent>
//                       <CardActions
//                         sx={{ p: 1.5, pt: 0, justifyContent: "flex-end" }}
//                       >
//                         <Button
//                           endIcon={<ArrowForward />}
//                           variant="contained"
//                           size="small"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             navigate(`/form/${item.arendenummerArtvise}`);
//                           }}
//                         >
//                           Visa detaljer
//                         </Button>
//                       </CardActions>
//                     </Card>
//                   </Grid>
//                 ))}
//               </Grid>
//             </Paper>
//             {viewMode === "cards" &&
//               cardPaginationEnabled &&
//               filteredItems.length > CARD_ITEMS_PER_PAGE && (
//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "center",
//                     mt: 4,
//                     mb: 2,
//                   }}
//                 >
//                   <Pagination
//                     count={cardTotalPages}
//                     page={page}
//                     onChange={(_e, value) => setPage(value)}
//                     color="primary"
//                     size="large"
//                     showFirstButton
//                     showLastButton
//                   />
//                 </Box>
//               )}
//           </>
//         ) : (
//           <>
//             <TableContainer
//               component={Paper}
//               elevation={2}
//               sx={{
//                 borderRadius: 3,
//                 border: "1px solid",
//                 borderColor: "divider",
//                 overflow: "hidden",
//                 overflowX: "auto",
//               }}
//             >
//               <Table
//                 size={isDownSm ? "small" : "medium"}
//                 sx={{ minWidth: isDownMd ? 640 : 760 }}
//               >
//                 <TableHead>
//                   <TableRow sx={{ backgroundColor: "grey.100" }}>
//                     <TableCell
//                       sx={{ fontWeight: 700, py: 1.5, whiteSpace: "nowrap" }}
//                     >
//                       Ärendenummer
//                     </TableCell>
//                     <TableCell
//                       sx={{ fontWeight: 700, py: 1.5, whiteSpace: "nowrap" }}
//                     >
//                       Beställare
//                     </TableCell>
//                     <TableCell
//                       sx={{ fontWeight: 700, py: 1.5, whiteSpace: "nowrap" }}
//                     >
//                       Datum inkommet
//                     </TableCell>
//                     {!isDownSm && (
//                       <TableCell
//                         sx={{ fontWeight: 700, py: 1.5, whiteSpace: "nowrap" }}
//                       >
//                         Kategori
//                       </TableCell>
//                     )}
//                     {!isDownSm && (
//                       <TableCell
//                         sx={{ fontWeight: 700, py: 1.5, whiteSpace: "nowrap" }}
//                       >
//                         Prioritet
//                       </TableCell>
//                     )}
//                     <TableCell align="right" sx={{ fontWeight: 700, py: 1.5 }}>
//                       Åtgärd
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {paginatedItems.map((item) => (
//                     <TableRow
//                       key={item.arendenummerArtvise}
//                       sx={{
//                         cursor: "pointer",
//                         "& td": { py: 1.25 },
//                         "&:hover": { backgroundColor: "action.hover" },
//                       }}
//                       onClick={() =>
//                         navigate(`/form/${item.arendenummerArtvise}`)
//                       }
//                     >
//                       <TableCell sx={{ fontWeight: 500 }}>
//                         {item.arendenummerArtvise ?? "-"}
//                       </TableCell>
//                       <TableCell>
//                         <Box
//                           sx={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: 0.5,
//                           }}
//                         >
//                           <Person
//                             sx={{ fontSize: 16, color: "text.secondary" }}
//                           />
//                           <Typography variant="body2" color="text.secondary">
//                             {item.bestallareOrganisation ?? "-"}
//                           </Typography>
//                         </Box>
//                       </TableCell>
//                       <TableCell>
//                         <Box
//                           sx={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: 0.5,
//                           }}
//                         >
//                           <CalendarToday
//                             sx={{ fontSize: 16, color: "text.secondary" }}
//                           />
//                           <Typography variant="body2" color="text.secondary">
//                             {item.datumInkommet ?? "-"}
//                           </Typography>
//                         </Box>
//                       </TableCell>
//                       {!isDownSm && (
//                         <TableCell>{item.kategori ?? "-"}</TableCell>
//                       )}
//                       {!isDownSm && (
//                         <TableCell>
//                           {item.prioritet ? (
//                             <Chip
//                               label={item.prioritet}
//                               size="small"
//                               color={getPrioritetChipColor(item.prioritet)}
//                               variant="filled"
//                             />
//                           ) : (
//                             "-"
//                           )}
//                         </TableCell>
//                       )}
//                       <TableCell align="right">
//                         <IconButton
//                           size="small"
//                           color="primary"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             navigate(`/form/${item.arendenummerArtvise}`);
//                           }}
//                         >
//                           <ArrowForward fontSize="small" />
//                         </IconButton>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//             {filteredItems.length > 0 && (
//               <Box
//                 sx={{
//                   display: "flex",
//                   justifyContent: "center",
//                   mt: 5.5,
//                   mb: 2,
//                 }}
//               >
//                 <Pagination
//                   count={totalPages}
//                   page={page}
//                   onChange={(_e, value) => setPage(value)}
//                   color="primary"
//                   size="large"
//                   showFirstButton
//                   showLastButton
//                 />
//               </Box>
//             )}
//           </>
//         )}
//       </Container>
//     </Box>
//   );
// }
