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
import { useSession } from 'next-auth/react';
import Loading from '@/app/loading';

type PostForm = {
    title: string;
    content: string;
    mediaUrl?: string;
    postType: 'text' | 'image' | 'video';
};

export default function ClientComponent() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [authChecked, setAuthChecked] = useState(false);
    const [uploading, setUploading] = useState(false);

    const form = useForm<PostForm>({
        defaultValues: {
            title: '',
            content: '',
            postType: 'text'
        }
    });

    const mediaUrl = form.watch('mediaUrl');

    // Auth check effect
    useEffect(() => {
        if (status === "loading") return;
        if (!session?.user || session.user.role !== "owner") {
            router.replace("/unauthorized");
        } else {
            setAuthChecked(true);
        }
    }, [status, session, router]);

    // Form effect
    useEffect(() => {
        if (!mediaUrl) {
            form.setValue('postType', 'text');
        }
    }, [form, mediaUrl]);

    if (status === "loading" || !authChecked) {
        return <Loading />;
    }

    const onSubmit = async (data: PostForm) => {
        try {
            if (data.postType !== 'text' && !data.mediaUrl) {
                toast.error('Please upload a file for image/video posts');
                return;
            }

            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast.success('Post created successfully!');
                router.push('/posts');
            } else {
                toast.error('Failed to create post');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            toast.error('An error occurred');
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Crie um novo post</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Título</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Título do post" required />
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
                                <FormLabel>Conteúdo</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="Escreva Seu Anúncio Aqui..."
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
                                <FormLabel>Tipo de post</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select post type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="text">Texto</SelectItem>
                                        <SelectItem value="image">Imagem</SelectItem>
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
                                <FormLabel>Envie Uma Imagem (opcional)</FormLabel>
                                <FormControl className='bg-black'>
                                    <div className="flex flex-col gap-4">
                                        <UploadButton<OurFileRouter, "imageUploader">
                                            endpoint="imageUploader"
                                            onClientUploadComplete={(res) => {
                                                if (res?.[0]?.url) {
                                                    field.onChange(res[0].url);
                                                    // Auto-detect type but allow override
                                                    const detectedType = res[0].type === 'image' ? 'image' :'video';
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
                            {uploading ? 'Publicando...' : 'Publicar post'}
                        </Button>
                        <Button variant="outline" onClick={() => router.push('/posts')}>
                            Cancelar
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}