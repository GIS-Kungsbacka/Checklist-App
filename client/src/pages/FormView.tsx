import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  Stack,
  Chip,
} from "@mui/material";
import { ArrowBack, Save } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { formsApi } from "../api/formsApi";

interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "number"
    | "textarea"
    | "radio"
    | "checkbox"
    | "select";
  required?: boolean;
  placeholder?: string;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

interface FormSchema {
  fields: FormField[];
  title?: string;
  description?: string;
}

export default function FormView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    data: form,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["form", id],
    queryFn: () => formsApi.getById(Number(id)),
    enabled: !!id,
  });

  useEffect(() => {
    if (form?.schemaJson) {
      try {
        const schema: FormSchema = JSON.parse(form.schemaJson);
        const initialValues: Record<string, any> = {};
        schema.fields?.forEach((field) => {
          if (field.type === "checkbox") {
            initialValues[field.name] = false;
          } else if (
            field.type === "radio" &&
            field.options &&
            field.options.length > 0
          ) {
            initialValues[field.name] = "";
          } else {
            initialValues[field.name] = "";
          }
        });
        setFormValues(initialValues);
      } catch (e) {
        console.error("Failed to parse schema:", e);
      }
    }
  }, [form]);

  const parseSchema = (): FormSchema | null => {
    if (!form?.schemaJson) return null;
    try {
      return JSON.parse(form.schemaJson);
    } catch (e) {
      return null;
    }
  };

  const validateField = (field: FormField, value: any): string => {
    if (
      field.required &&
      (!value || (typeof value === "string" && value.trim() === ""))
    ) {
      return `${field.label} is required`;
    }

    if (value && field.type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return "Please enter a valid email address";
      }
    }

    if (value && field.type === "number" && field.validation) {
      const numValue = Number(value);
      if (
        field.validation.min !== undefined &&
        numValue < field.validation.min
      ) {
        return `Value must be at least ${field.validation.min}`;
      }
      if (
        field.validation.max !== undefined &&
        numValue > field.validation.max
      ) {
        return `Value must be at most ${field.validation.max}`;
      }
    }

    return "";
  };

  const handleChange = (fieldName: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [fieldName]: value }));
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  const handleSubmit = async () => {
    const schema = parseSchema();
    if (!schema) return;

    const newErrors: Record<string, string> = {};
    schema.fields?.forEach((field) => {
      const error = validateField(field, formValues[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Here you would typically submit to an API endpoint
      // For now, we'll simulate a submission
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="md">
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

  if (error || !form) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">
            Failed to load form. Please try again later.
          </Alert>
        </Box>
      </Container>
    );
  }

  if (!form.isActive) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Alert severity="warning">This form is currently inactive.</Alert>
        </Box>
      </Container>
    );
  }

  const schema = parseSchema();
  if (!schema || !schema.fields || schema.fields.length === 0) {
    return (
      <Container maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Alert severity="warning">This form has no fields configured.</Alert>
        </Box>
      </Container>
    );
  }

  const renderField = (field: FormField) => {
    const value = formValues[field.name] || "";
    const error = errors[field.name];

    switch (field.type) {
      case "textarea":
        return (
          <TextField
            key={field.name}
            fullWidth
            label={field.label}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            error={!!error}
            helperText={error || field.placeholder}
            required={field.required}
            multiline
            rows={4}
            margin="normal"
          />
        );

      case "radio":
        return (
          <FormControl
            key={field.name}
            fullWidth
            margin="normal"
            error={!!error}
            required={field.required}
          >
            <FormLabel>{field.label}</FormLabel>
            <RadioGroup
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value)}
            >
              {field.options?.map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
            {error && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                {error}
              </Typography>
            )}
          </FormControl>
        );

      case "checkbox":
        return (
          <FormControl
            key={field.name}
            fullWidth
            margin="normal"
            error={!!error}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={value || false}
                  onChange={(e) => handleChange(field.name, e.target.checked)}
                />
              }
              label={field.label}
            />
            {error && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                {error}
              </Typography>
            )}
          </FormControl>
        );

      case "select":
        return (
          <TextField
            key={field.name}
            fullWidth
            select
            label={field.label}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            error={!!error}
            helperText={error || field.placeholder}
            required={field.required}
            margin="normal"
            SelectProps={{
              native: true,
            }}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </TextField>
        );

      default:
        return (
          <TextField
            key={field.name}
            fullWidth
            type={field.type}
            label={field.label}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            error={!!error}
            helperText={error || field.placeholder}
            required={field.required}
            margin="normal"
            slotProps={{
              htmlInput: {
                min: field.validation?.min,
                max: field.validation?.max,
              },
            }}
          />
        );
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate("/")}
        sx={{ mb: 3 }}
      >
        Back to Forms
      </Button>

      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              fontWeight={600}
            >
              {schema.title || form.name}
            </Typography>
            {(schema.description || form.description) && (
              <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                {schema.description || form.description}
              </Typography>
            )}
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Chip
                label={form.isActive ? "Active" : "Inactive"}
                color={form.isActive ? "success" : "default"}
                size="small"
              />
            </Stack>
          </Box>

          <Divider sx={{ my: 3 }} />

          {submitSuccess ? (
            <Alert severity="success" sx={{ mb: 3 }}>
              Form submitted successfully! Redirecting...
            </Alert>
          ) : (
            <>
              <Box component="form" sx={{ mt: 2 }}>
                {schema.fields.map((field) => renderField(field))}
              </Box>

              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  gap: 2,
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => navigate("/")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  size="large"
                >
                  {isSubmitting ? "Submitting..." : "Submit Form"}
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
