import { z } from "zod";

export const SignupSchema = z.object({
    email: z.string().email({ message: "Invalid Email" }).min(1, { message: "Email is required" }),
    password: z.string().min(1, { message: "Password is required" })
});


export const LoginSchema = z.object({
    email: z.string().email({ message: "Invalid Email" }).min(1, { message: "Email is required" }),
    password: z.string().min(1, { message: "Password is required" })
});