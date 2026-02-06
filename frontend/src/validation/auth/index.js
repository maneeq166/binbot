import { z } from "zod";

export const registerSchema = z
  .object({
    username: z.string().min(3).max(15),
    email: z.string().email("Invalid email"),
    password: z.string().min(4).max(25),
    confirmPassword: z.string().min(4).max(25),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
    email:z.string().email("Invalid Email"),
    password:z.string().min(4,"Password must more than 3 characters").max(25,"Password must be less than 26 characters")
})
