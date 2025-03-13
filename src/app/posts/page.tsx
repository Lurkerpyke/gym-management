'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { MegaphoneIcon, PlusCircleIcon } from 'lucide-react';

type Post = {
    id: string;
    title: string;
    content: string;
    mediaUrl?: string;
    postType: string;
    author: {
        name?: string;
        image?: string;
    };
    createdAt: Date;
    categories?: string[];
    scheduledAt?: Date;
    reactions?: {
        likes: number;
        hearts: number;
    };
    comments?: Comment[];
};

export default function PostsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);


    // Redirect unauthenticated users
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/signin');
        }
    }, [status, router]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('/api/posts');
                const data = await response.json();
                
                // Validate post types
                const validatedPosts = data.map((post: any) => ({
                    ...post,
                    postType: ['image', 'video', 'text'].includes(post.postType) 
                        ? post.postType 
                        : 'text'
                }));
                
                setPosts(validatedPosts);
            } catch (error) {
                console.error('Failed to load posts:', error);
            } finally {
                setLoading(false);
            }
        };

        if (status === 'authenticated') {
            fetchPosts();
        }
    }, [status]);

    if (status !== 'authenticated') {
        return (
            <div className="container mx-auto p-4 space-y-4">
                <Skeleton className="h-10 w-1/4" />
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-[200px] w-full" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <h1 className="text-3xl font-bold text-primary">🏋️♂️ Gym Announcements</h1>
                {['owner', 'admin'].includes(session.user.role) && (
                    <Button asChild className="w-full md:w-auto bg-primary hover:bg-primary/90">
                        <Link href="/posts/create" className="gap-2">
                            <PlusCircleIcon className="h-4 w-4" />
                            <span>New Post</span>
                        </Link>
                    </Button>
                )}
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start auto-rows-[minmax(400px,auto)]">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardHeader className="space-y-2">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Skeleton className="h-48 w-full rounded-lg" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </CardContent>
                            <CardFooter className="flex justify-between p-4 pt-0">
                                <Skeleton className="h-8 w-24" />
                                <Skeleton className="h-8 w-24" />
                            </CardFooter>
                        </Card>
                    ))
                ) : posts.length > 0 ? (
                    posts.map((post) => (
                        <Card key={post.id} className="hover:shadow-lg transition-shadow flex flex-col min-h-full">
                            {/* Author Section */}
                            <CardHeader className="flex flex-row items-center gap-4 pb-4">
                                <Avatar className="h-12 w-12 border-2 border-primary">
                                    <AvatarImage src={post.author.image} />
                                    <AvatarFallback className="bg-muted">
                                        {post.author.name?.[0] || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg">{post.author.name || 'Staff Member'}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                                    </p>
                                </div>
                            </CardHeader>

                            {/* Post Content */}
                            <CardContent className="flex-1 space-y-4 flex flex-col">
                                <h2 className="text-xl font-bold text-primary">{post.title}</h2>

                                {post.mediaUrl && (
                                    <div className="relative max-w-full max-h-[200px] mx-auto rounded-xl overflow-hidden border">
                                        {post.postType === 'image' ? (
                                            <img
                                                src={post.mediaUrl}
                                                alt="Post media"
                                                className="object-cover w-full h-full"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <video controls className="w-full h-full" key={post.mediaUrl}>
                                                <source src={post.mediaUrl} type="video/mp4" />
                                                <source src={post.mediaUrl} type="video/webm" />
                                                Your browser does not support the video tag.
                                            </video>
                                        )}
                                    </div>
                                )}

                                <div className="flex-1 overflow-y-auto">
                                    <div
                                        className="prose prose-sm dark:prose-invert max-w-none break-words whitespace-pre-wrap max-h-[200px] overflow-y-auto"
                                        dangerouslySetInnerHTML={{ __html: post.content }}
                                    />
                                </div>

                                {post.categories && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {post.categories.map((category) => (
                                            <Badge
                                                key={category}
                                                variant="outline"
                                                className="border-primary text-primary hover:bg-primary/10"
                                            >
                                                #{category}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </CardContent>

                            {/* Reactions & Comments */}
                            <CardFooter className="border-t p-4 pt-4 mt-auto">
                                <div className="flex w-full items-center justify-between">
                                    <div className="flex gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="hover:bg-primary/10 text-muted-foreground hover:text-primary"
                                        >
                                            ❤️ <span className="ml-2">{post.reactions?.hearts || 0}</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="hover:bg-primary/10 text-muted-foreground hover:text-primary"
                                        >
                                            👍 <span className="ml-2">{post.reactions?.likes || 0}</span>
                                        </Button>
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="hover:bg-primary/10 hover:text-primary"
                                    >
                                        💬 <span className="ml-2">{post.comments?.length || 0}</span>
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 space-y-4">
                        <MegaphoneIcon className="h-12 w-12 text-muted-foreground mx-auto" />
                        <p className="text-xl text-muted-foreground">No announcements yet</p>
                        <p className="text-sm text-muted-foreground">Check back later for updates!</p>
                    </div>
                )}
            </div>
        </div>
    );
}