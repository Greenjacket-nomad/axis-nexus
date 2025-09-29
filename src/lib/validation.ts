import { z } from 'zod';

// Contact form validation schema
export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  interest: z
    .string()
    .min(1, { message: "Please select an area of interest" }),
  subject: z
    .string()
    .trim()
    .min(5, { message: "Subject must be at least 5 characters" })
    .max(200, { message: "Subject must be less than 200 characters" }),
  message: z
    .string()
    .trim()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(2000, { message: "Message must be less than 2000 characters" }),
});

// Subscription form validation schema
export const subscriptionFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  interest: z
    .string()
    .min(1, { message: "Please select an area of interest" }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type SubscriptionFormData = z.infer<typeof subscriptionFormSchema>;

// Validation errors type
export interface ValidationErrors {
  [key: string]: string;
}

// Error types for better error handling
export enum ErrorType {
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  TIMEOUT = 'timeout',
  NETWORK = 'network',
  SERVER = 'server',
  UNKNOWN = 'unknown'
}

// Helper function to validate form data and return errors
export function validateContactForm(data: any): ValidationErrors {
  try {
    contactFormSchema.parse(data);
    return {};
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationErrors = {};
      error.issues.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      return errors;
    }
    return { form: 'Validation error occurred' };
  }
}

export function validateSubscriptionForm(data: any): ValidationErrors {
  try {
    subscriptionFormSchema.parse(data);
    return {};
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationErrors = {};
      error.issues.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0] as string] = err.message;
        }
      });
      return errors;
    }
    return { form: 'Validation error occurred' };
  }
}