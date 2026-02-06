import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Button,
  Card,
  CardContent,
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
} from "@mui/material";
import { Add, Edit, Delete, Visibility } from "@mui/icons-material";
import { useState } from "react";
import { formsApi } from "../api/formsApi";
import type { Form, CreateFormDto } from "../types/form";

export default function FormsList() {
  const queryClient = useQueryClient();
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState<Form | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Form | null>(null);
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

  const createMutation = useMutation({
    mutationFn: formsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forms"] });
      setOpenCreate(false);
      setFormData({ name: "", description: "", schemaJson: "{}", isActive: true });
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

  const handleCreate = () => {
    createMutation.mutate(formData);
  };

  const handleUpdate = () => {
    if (openEdit) {
      updateMutation.mutate({ id: openEdit.id, dto: formData });
    }
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      deleteMutation.mutate(deleteConfirm.id);
    }
  };

  const handleEditClick = (form: Form) => {
    setOpenEdit(form);
    setFormData({
      name: form.name,
      description: form.description,
      schemaJson: form.schemaJson,
      isActive: form.isActive,
    });
  };

  if (isLoading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Forms Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenCreate(true)}
        >
          Create Form
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created By</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {forms?.map((form) => (
              <TableRow key={form.id}>
                <TableCell>{form.id}</TableCell>
                <TableCell>{form.name}</TableCell>
                <TableCell>{form.description || "-"}</TableCell>
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
                  <IconButton
                    size="small"
                    onClick={() => handleEditClick(form)}
                    title="Edit"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => setDeleteConfirm(form)}
                    color="error"
                    title="Delete"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {forms?.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="text.secondary" sx={{ py: 2 }}>
                    No forms found. Create your first form to get started.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Dialog */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Form</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            label="Schema JSON"
            value={formData.schemaJson}
            onChange={(e) =>
              setFormData({ ...formData, schemaJson: e.target.value })
            }
            margin="normal"
            multiline
            rows={6}
            helperText="JSON schema defining the form structure"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button
            onClick={handleCreate}
            variant="contained"
            disabled={!formData.name || createMutation.isPending}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={openEdit !== null}
        onClose={() => setOpenEdit(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Form</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            margin="normal"
            multiline
            rows={3}
          />
          <TextField
            fullWidth
            label="Schema JSON"
            value={formData.schemaJson}
            onChange={(e) =>
              setFormData({ ...formData, schemaJson: e.target.value })
            }
            margin="normal"
            multiline
            rows={6}
            helperText="JSON schema defining the form structure"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(null)}>Cancel</Button>
          <Button
            onClick={handleUpdate}
            variant="contained"
            disabled={!formData.name || updateMutation.isPending}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
      >
        <DialogTitle>Delete Form</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{deleteConfirm?.name}"? This action
            cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
