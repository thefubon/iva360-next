import { z } from 'zod'

export const userSessionSchema = z.object({
  id: z.string(),
  createdAt: z.string().nullable().optional(),
  expiresAt: z.string(),
})

export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  updatedAt: z.string(),
  createdAt: z.string(),
  resetPasswordToken: z.string().nullable().optional(),
  resetPasswordExpiration: z.string().nullable().optional(),
  loginAttempts: z.number().nullable().optional(),
  lockUntil: z.string().nullable().optional(),
  sessions: z.array(userSessionSchema).nullable().optional(),
  collection: z.literal('users'),
})

export const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const userCreateSchema = userLoginSchema

export type UserInput = z.infer<typeof userSchema>
export type UserLoginInput = z.infer<typeof userLoginSchema>
