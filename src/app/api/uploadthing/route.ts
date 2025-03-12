// app/api/uploadthing/route.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { createRouteHandler } from "uploadthing/next";

const f = createUploadthing();

export const fileRouter = {
    imageUploader: f({
        image: { maxFileSize: "4MB", maxFileCount: 1 },
        video: { maxFileSize: "16MB", maxFileCount: 1 }
    }).onUploadComplete(async ({ file }) => {
        const isImage = file.type.startsWith('image/');

        return {
            url: file.ufsUrl,
            name: file.name,
            type: isImage ? 'image' : 'video' as const
        };
    }),
} satisfies FileRouter;

export const { GET, POST } = createRouteHandler({
    router: fileRouter,
});

export type OurFileRouter = typeof fileRouter;