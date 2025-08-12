import z from "zod";

export const signinWithEmailSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string(),
});

export const signinWithTelegramSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String), // Telegram sends id as string or number, convert to string
  username: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  auth_date: z.union([z.string(), z.number()]).transform(Number), // auth_date as number (seconds)
  hash: z.string(),
  photo_url: z.string().optional(),
});

export const signupWithEmailSchema = z.object({
    email: z.email(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    username: z.string().min(4, "Name must be at least 4 characters long").max(100, "Name must be at most 100 characters long"),
    role: z.string().refine(
        (value) => ["super","admin"].includes(value),
        {
            message: "Role must be either 'super' or 'admin'",
        }
    )
})

export type SigninWithTelegramInput = z.infer<typeof signinWithTelegramSchema>;
export type SigninWithEmailInput = z.infer<typeof signinWithEmailSchema>;
export type SignupWithEmailInput = z.infer<typeof signupWithEmailSchema>;
