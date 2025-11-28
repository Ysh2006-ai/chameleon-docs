import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
    name: string;
    slug: string;
    description?: string;
    ownerEmail: string; // Linking by email for simplicity (or use ObjectId if using Auth)
    isPublic: boolean;
    theme: {
        color: string;
        font: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true, index: true },
        description: { type: String },
        ownerEmail: { type: String, required: true, index: true },
        isPublic: { type: Boolean, default: false },
        theme: {
            color: { type: String, default: "indigo" },
            font: { type: String, default: "Inter" },
        },
    },
    { timestamps: true }
);

// Prevent model overwrite error in Next.js hot reload
const Project: Model<IProject> =
    mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;