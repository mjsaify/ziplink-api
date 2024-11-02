import { z } from "zod";

export const SignupSchema = z.object({
    fullname: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid Email" }).min(1, { message: "Email is required" }),
    password: z.string().min(1, { message: "Password is required" })
});


export const LoginSchema = z.object({
    email: z.string().email({ message: "Invalid Email" }).min(1, { message: "Email is required" }),
    password: z.string().min(1, { message: "Password is required" })
});

export const UrlSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    originalUrl: z.string().min(1, { message: "Url is required" }).url({ message: "Invalid url" }),
    customLink: z.string().optional(),
});

export const UpdateUserNameAndEmail = z.object({
    fullname: z.string().optional(),
    email: z.string().optional().refine((val) => !val || z.string().email().safeParse(val).success, { message: "Invalid Email"}),
}).refine((val) => val.fullname || val.email !== "");


export const UpdateUserPasswordSchema = z.object({
    confirmPassword: z.string().min(6, { message: "Password must be 6 characters long" }),
})