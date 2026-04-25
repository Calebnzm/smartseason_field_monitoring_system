import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const acceptInviteSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const createFieldSchema = z.object({
  name: z.string().min(3, 'Field name is required'),
  crop_type: z.string().min(1, 'Crop type is required'),
  location_latitude: z.string().regex(/^-?\d+(\.\d+)?$/, 'Invalid latitude'),
  location_longitude: z.string().regex(/^-?\d+(\.\d+)?$/, 'Invalid longitude'),
  size_hectares: z.string().regex(/^\d+(\.\d+)?$/, 'Invalid size'),
  planting_date: z.string().min(1, 'Planting date is required'),
  assigned_agent: z.string().optional(),
});

export const updateFieldSchema = createFieldSchema;

export type LoginInput = z.infer<typeof loginSchema>;
export type AcceptInviteInput = z.infer<typeof acceptInviteSchema>;
export type CreateFieldInput = z.infer<typeof createFieldSchema>;
export type UpdateFieldInput = z.infer<typeof updateFieldSchema>;
