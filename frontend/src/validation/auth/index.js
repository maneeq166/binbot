import { z } from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const registerSchema = z
  .object({
    username: z.string().min(3).max(15),
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .regex(
        passwordRegex,
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
      )
      .max(25),
    confirmPassword: z.string().min(8).max(25),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().email("Invalid Email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(25, "Password must be less than 26 characters"),
});
