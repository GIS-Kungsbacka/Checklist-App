import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Button,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  CircularProgress,
  Alert,
  Tooltip,
  Stack,
  Divider,
  InputAdornment,
  Pagination,
} from "@mui/material";
import { Add, Edit, Delete, Code, Search } from "@mui/icons-material";
import { useState, useMemo } from "react";
import { formsApi } from "../api/formsApi";
import type { Form, CreateFormDto } from "../types/form";

const ITEMS_PER_PAGE = 10;

export default function FormsList() {
  const queryClient = useQueryClient();
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState<Form | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Form | null>(null);
  const [schemaError, setSchemaError] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [formData, setFormData] = useState<CreateFormDto>({
    name: "",
    description: "",
    schemaJson: "{}",
    isActive: true,
  });

  const { data: forms, isLoading } = useQuery({
    queryKey: ["forms"],
    queryFn: formsApi.getAll,
  });

  // Filter forms based on search query
  const filteredForms = useMemo(() => {
    if (!forms) return [];
    if (!searchQuery.trim()) return forms;

    const query = searchQuery.toLowerCase().trim();
    return forms.filter(
      (form) =>
        form.name.toLowerCase().includes(query) ||
        form.description?.toLowerCase().includes(query) ||
        form.createdBy.toLowerCase().includes(query) ||
        form.id.toString().includes(query),
    );
  }, [forms, searchQuery]);

  // Paginate filtered forms
  const paginatedForms = useMemo(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return filteredForms.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredForms, page]);

  const totalPages = Math.ceil(filteredForms.length / ITEMS_PER_PAGE);

  // Reset to page 1 when search changes
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };

  const createMutation = useMutation({
    mutationFn: formsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      setOpenCreate(false);
      setFormData({
        name: "",
        description: "",
        schemaJson: "{}",
        isActive: true,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: CreateFormDto }) =>
      formsApi.update(id, { ...dto, isActive: dto.isActive ?? true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      setOpenEdit(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: formsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      setDeleteConfirm(null);
    },
  });

  const handleDelete = () => {
    if (deleteConfirm) {
      deleteMutation.mutate(deleteConfirm.id);
    }
  };

  const handleCloseCreate = () => {
    setOpenCreate(false);
    setFormData({
      name: "",
      description: "",
      schemaJson: "{}",
      isActive: true,
    });
    setSchemaError("");
  };

  const handleCloseEdit = () => {
    setOpenEdit(null);
    setSchemaError("");
  };

  const handleEditClick = (form: Form) => {
    setOpenEdit(form);
    setFormData({
      name: form.name,
      description: form.description,
      schemaJson: form.schemaJson,
      isActive: form.isActive,
    });
    setSchemaError("");
  };

  const validateSchema = (json: string): boolean => {
    try {
      const parsed = JSON.parse(json);
      if (typeof parsed !== "object" || parsed === null) {
        setSchemaError("Schema must be a valid JSON object");
        return false;
      }
      setSchemaError("");
      return true;
    } catch (e) {
      setSchemaError("Invalid JSON format");
      return false;
    }
  };

  const handleSchemaChange = (value: string) => {
    setFormData({ ...formData, schemaJson: value });
    validateSchema(value);
  };

  const handleCreate = () => {
    if (!validateSchema(formData.schemaJson || "{}")) return;
    createMutation.mutate(formData);
  };

  const handleUpdate = () => {
    if (!openEdit) return;
    if (!validateSchema(formData.schemaJson || "{}")) return;
    updateMutation.mutate({ id: openEdit.id, dto: formData });
  };

  const formatSchemaPreview = (schemaJson: string): string => {
    try {
      const parsed = JSON.parse(schemaJson);
      if (parsed.fields && Array.isArray(parsed.fields)) {
        return `${parsed.fields.length} field(s) defined`;
      }
      return "No fields defined";
    } catch {
      return "Invalid schema";
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="xl">
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

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 6 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
        flexWrap="wrap"
        gap={2}
      >
        <Box>
          <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
            Forms Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create, edit, and manage your forms
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setOpenCreate(true);
            setFormData({
              name: "",
              description: "",
              schemaJson: "{}",
              isActive: true,
            });
            setSchemaError("");
          }}
          size="large"
          sx={{ height: 42 }}
        >
          Create Form
        </Button>
      </Box>

      {/* Search Bar */}
      <Box mb={3}>
        <TextField
          fullWidth
          placeholder="Search forms by name, description, creator, or ID..."
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
            Showing {filteredForms.length} of {forms?.length || 0} forms
          </Typography>
        )}
      </Box>

      {createMutation.isError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          Failed to create form. Please try again.
        </Alert>
      )}

      {updateMutation.isError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          Failed to update form. Please try again.
        </Alert>
      )}

      {deleteMutation.isError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          Failed to delete form. Please try again.
        </Alert>
      )}

      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "grey.50" }}>
              <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Schema</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Created By</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Created At</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedForms.map((form) => (
              <TableRow
                key={form.id}
                sx={{
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              >
                <TableCell>{form.id}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {form.name}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      maxWidth: 200,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {form.description || "-"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Tooltip title={form.schemaJson} arrow>
                    <Chip
                      icon={<Code />}
                      label={formatSchemaPreview(form.schemaJson)}
                      size="small"
                      variant="outlined"
                    />
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Chip
                    label={form.isActive ? "Active" : "Inactive"}
                    color={form.isActive ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>{form.createdBy}</TableCell>
                <TableCell>
                  {new Date(form.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell align="right">
                  <Stack
                    direction="row"
                    spacing={0.5}
                    justifyContent="flex-end"
                  >
                    <Tooltip title="Edit" arrow>
                      <IconButton
                        size="small"
                        onClick={() => handleEditClick(form)}
                        color="primary"
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete" arrow>
                      <IconButton
                        size="small"
                        onClick={() => setDeleteConfirm(form)}
                        color="error"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {paginatedForms.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <Box>
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      {searchQuery
                        ? "No forms match your search"
                        : "No forms found"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {searchQuery
                        ? "Try adjusting your search query"
                        : "Create your first form to get started."}
                    </Typography>
                    {!searchQuery && (
                      <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => {
                          setOpenCreate(true);
                          setFormData({
                            name: "",
                            description: "",
                            schemaJson: "{}",
                            isActive: true,
                          });
                          setSchemaError("");
                        }}
                      >
                        Create Form
                      </Button>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {filteredForms.length > 0 && (
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

      {/* Create Dialog */}
      <Dialog
        open={openCreate}
        onClose={handleCloseCreate}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 2 },
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" fontWeight={600}>
            Create New Form
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Form Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              helperText="Enter a descriptive name for this form"
              error={createMutation.isError}
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              multiline
              rows={3}
              helperText="Optional description of what this form is used for"
            />
            <Box>
              <TextField
                fullWidth
                label="Schema JSON"
                value={formData.schemaJson}
                onChange={(e) => handleSchemaChange(e.target.value)}
                multiline
                rows={8}
                error={!!schemaError}
                helperText={
                  schemaError ||
                  'JSON schema defining the form structure. Example: {"fields": [{"name": "email", "label": "Email", "type": "email", "required": true}]}'
                }
                sx={{
                  "& .MuiInputBase-root": {
                    fontFamily: "monospace",
                    fontSize: "0.875rem",
                  },
                }}
              />
              {schemaError && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {schemaError}
                </Alert>
              )}
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive ?? true}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                />
              }
              label="Active"
            />
          </Stack>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={handleCloseCreate}
            disabled={createMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            disabled={
              !formData.name || !!schemaError || createMutation.isPending
            }
            sx={{ minWidth: 100 }}
          >
            {createMutation.isPending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Create"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={openEdit !== null}
        onClose={handleCloseEdit}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 2 },
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" fontWeight={600}>
            Edit Form
          </Typography>
          {openEdit && (
            <Typography variant="caption" color="text.secondary">
              Form ID: {openEdit.id}
            </Typography>
          )}
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Form Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              helperText="Enter a descriptive name for this form"
              error={updateMutation.isError}
            />
            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              multiline
              rows={3}
              helperText="Optional description of what this form is used for"
            />
            <Box>
              <TextField
                fullWidth
                label="Schema JSON"
                value={formData.schemaJson}
                onChange={(e) => handleSchemaChange(e.target.value)}
                multiline
                rows={8}
                error={!!schemaError}
                helperText={
                  schemaError ||
                  'JSON schema defining the form structure. Example: {"fields": [{"name": "email", "label": "Email", "type": "email", "required": true}]}'
                }
                sx={{
                  "& .MuiInputBase-root": {
                    fontFamily: "monospace",
                    fontSize: "0.875rem",
                  },
                }}
              />
              {schemaError && (
                <Alert severity="error" sx={{ mt: 1 }}>
                  {schemaError}
                </Alert>
              )}
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive ?? true}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                />
              }
              label="Active"
            />
          </Stack>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleCloseEdit} disabled={updateMutation.isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            variant="contained"
            disabled={
              !formData.name || !!schemaError || updateMutation.isPending
            }
            sx={{ minWidth: 100 }}
          >
            {updateMutation.isPending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Update"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 2 },
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" fontWeight={600} color="error">
            Delete Form
          </Typography>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ pt: 3 }}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This action cannot be undone.
          </Alert>
          <Typography variant="body1">
            Are you sure you want to delete the form{" "}
            <strong>"{deleteConfirm?.name}"</strong>?
          </Typography>
          {deleteConfirm && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Form ID: {deleteConfirm.id}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                display="block"
              >
                Created by: {deleteConfirm.createdBy}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => setDeleteConfirm(null)}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
            sx={{ minWidth: 100 }}
          >
            {deleteMutation.isPending ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Delete"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
