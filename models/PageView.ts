import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPageView extends Document {
    pageId: mongoose.Types.ObjectId;
    ipAddress: string;
    userAgent?: string;
    createdAt: Date;
}

const PageViewSchema = new Schema<IPageView>(
    {
        pageId: { type: Schema.Types.ObjectId, ref: "Page", required: true, index: true },
        ipAddress: { type: String, required: true, index: true },
        userAgent: { type: String },
        createdAt: { type: Date, default: Date.now, expires: 86400 } // TTL: auto-delete after 24 hours (86400 seconds)
    },
    { timestamps: false } // We only need createdAt for TTL, not updatedAt
);

// Compound index for efficient duplicate checking
PageViewSchema.index({ pageId: 1, ipAddress: 1, createdAt: 1 });

const PageView: Model<IPageView> =
    mongoose.models.PageView || mongoose.model<IPageView>("PageView", PageViewSchema);

export default PageView;
