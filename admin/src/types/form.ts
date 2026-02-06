export interface Form {
  id: number;
  name: string;
  description: string;
  schemaJson: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface CreateFormDto {
  name: string;
  description?: string;
  schemaJson?: string;
  isActive?: boolean;
}

export interface UpdateFormDto {
  name: string;
  description?: string;
  schemaJson?: string;
  isActive: boolean;
}
