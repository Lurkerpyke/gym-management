// components/MediaUpload.tsx
'use client';

import { UploadButton } from '@uploadthing/react';
import type { OurFileRouter } from '@/app/api/uploadthing/route';

export const MediaUpload = () => (
    <UploadButton<OurFileRouter, "imageUploader">
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
            console.log("Upload completed:", res);
            if (res?.[0]?.url) {
                // Handle successful upload
            }
        }}
        onUploadError={(error: Error) => {
            console.error("Upload error:", error);
            alert(`Upload failed: ${error.message}`);
        }}
    />
);