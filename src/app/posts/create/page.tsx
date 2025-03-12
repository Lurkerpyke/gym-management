'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { UploadButton } from '@uploadthing/react';
import type { OurFileRouter } from '@/app/api/uploadthing/route';
import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type PostForm = {
    title: string;
    content: string;
    mediaUrl?: string;
    postType: 'text' | 'image' | 'video';
};

export default function CreatePostPage() {
    const router = useRouter();
    const [uploading, setUploading] = useState(false);
    const form = useForm<PostForm>({
        defaultValues: {
            title: '',
            content: '',
            postType: 'text'
        }
    });

    useEffect(() => {
        if (!form.watch('mediaUrl')) {
            form.setValue('postType', 'text');
        }
    }, [form.watch('mediaUrl')]);

    const onSubmit = async (data: PostForm) => {
        try {
            // Validate media presence matches post type
            if (data.postType !== 'text' && !data.mediaUrl) {
                toast.error('Please upload a file for image/video posts');
                return;
            }

            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast.success('Post created successfully!');
                router.push('/posts');
            } else {
                toast.error('Failed to create post');
            }
        } catch (error) {
            toast.error('An error occurred');
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Create New Post</h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Enter post title" required />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="Write your announcement..."
                                        className="min-h-[150px]"
                                        required
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="postType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Post Type</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select post type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="text">Text Only</SelectItem>
                                        <SelectItem value="image">Image</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="mediaUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Upload Media (optional)</FormLabel>
                                <FormControl className='bg-black'>
                                    <div className="flex flex-col gap-4">
                                        <UploadButton<OurFileRouter, "imageUploader">
                                            endpoint="imageUploader"
                                            onClientUploadComplete={(res) => {
                                                if (res?.[0]?.url) {
                                                    field.onChange(res[0].url);
                                                    // Auto-detect type but allow override
                                                    const detectedType = res[0].type === 'image' ? 'image' : 'video';
                                                    if (form.getValues('postType') === 'text') {
                                                        form.setValue('postType', detectedType);
                                                    }
                                                }
                                                setUploading(false);
                                            }}
                                            onUploadBegin={() => setUploading(true)}
                                            onUploadError={(error: Error) => {
                                                toast.error(`Upload failed: ${error.message}`);
                                                setUploading(false);
                                            }}
                                            className="ut-button:bg-primary ut-button:ut-readying:bg-primary/50"
                                        />
                                        {field.value && (
                                            <div className="mt-2">
                                                <span className="text-sm text-muted-foreground">
                                                    Uploaded URL: {field.value}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex gap-4">
                        <Button type="submit" disabled={uploading}>
                            {uploading ? 'Uploading...' : 'Publish Post'}
                        </Button>
                        <Button variant="outline" onClick={() => router.push('/posts')}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}