"use server";

import { connectToDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function registerUser(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
        return { error: "Missing fields" };
    }

    try {
        await connectToDB();

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return { error: "Email already in use" };
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return { success: true };
    } catch (error) {
        console.error("Registration Error:", error);
        return { error: "Registration failed" };
    }
}