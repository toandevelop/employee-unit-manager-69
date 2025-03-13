
import * as z from 'zod';

// Define the interview form schema
export const interviewFormSchema = z.object({
  applicationId: z.string(),
  interviewDate: z.date(),
  interviewTime: z.string(),
  interviewType: z.enum(['phone', 'online', 'in-person']),
  interviewersInput: z.string(),
  location: z.string().optional(),
  meetingLink: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['scheduled', 'completed', 'canceled']),
  feedback: z.string().optional(),
  rating: z.number().optional(),
});

// Infer the types from the schema
export type InterviewFormValues = z.infer<typeof interviewFormSchema>;
