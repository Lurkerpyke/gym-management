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
import { MegaphoneIcon, MessageCircleIcon, NewspaperIcon, PlusCircleIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

type Comment = {
    id: string;
    content: string;
    createdAt: Date;
    author: {
        id: string;
        name?: string;
        image?: string;
    };
};

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

type ApiPost = Omit<Post, 'postType'> & {
    postType: string; // The API might return any string
};

function isValidPostType(type: string): type is 'image' | 'video' | 'text' {
    return ['image', 'video', 'text'].includes(type);
}

export default function PostsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [selectedMedia, setSelectedMedia] = useState<{ url: string; type: string } | null>(null);

    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentOpen, setCommentOpen] = useState(false);
    const { register, handleSubmit, reset } = useForm<{ content: string }>();




    const fetchComments = async (postId: string) => {
        try {
            setIsLoadingComments(true);
            const response = await fetch(`/api/posts/${postId}/comments?${Date.now()}`);
            const data = await response.json();
            setComments(data);
        } catch (error) {
            console.error('Failed to load comments:', error);
        } finally {
            setIsLoadingComments(false);
        }
    };

    const handleCommentSubmit = async (data: { content: string }) => {
        if (!selectedPostId || !session?.user?.id) return;

        try {
            const response = await fetch(`/api/posts/${selectedPostId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    authorId: session.user.id
                })
            });

            if (response.ok) {
                const newComment = await response.json();
                setComments(prev => [newComment, ...prev]);
                setPosts(prevPosts => prevPosts.map(post => {
                    if (post.id === selectedPostId) {
                        return {
                            ...post,
                            comments: [newComment, ...(post.comments || [])]
                        };
                    }
                    return post;
                }));
                reset();
            }
        } catch (error) {
            console.error('Failed to post comment:', error);
        }
    };

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

                const validatedPosts = data.map((post: ApiPost) => ({
                    ...post,
                    postType: isValidPostType(post.postType) ? post.postType : 'text'
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
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <h1 className="text-3xl font-bold text-primary flex gap-2 items-center justify-center flex-col md:flex-row"><NewspaperIcon className='h-8 w-8' />Anúncios</h1>
                {['owner', 'admin'].includes(session.user.role) && (
                    <Button asChild className="w-full md:w-auto bg-primary hover:bg-primary/90">
                        <Link href="/posts/create" className="gap-2">
                            <PlusCircleIcon className="h-4 w-4" />
                            <span>Novo Post</span>
                        </Link>
                    </Button>
                )}
            </div>

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
                            <Dialog open={!!selectedMedia} onOpenChange={(open) => !open && setSelectedMedia(null)}>
                                <DialogTitle className='hidden'>Post Media</DialogTitle>
                                <DialogContent className="max-w-[90vw] max-h-[90vh]">
                                    {selectedMedia?.type === 'image' ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={selectedMedia.url}
                                            alt="Enlarged post media"
                                            className="object-contain w-full h-full max-h-[80vh]"
                                        />
                                    ) : (
                                        <video
                                            controls
                                            className="w-full h-full"
                                            autoPlay
                                        >
                                            <source src={selectedMedia?.url} type="video/mp4" />
                                            <source src={selectedMedia?.url} type="video/webm" />
                                            Your browser does not support the video tag.
                                        </video>
                                    )}
                                </DialogContent>
                            </Dialog>

                            <CardContent className="flex-1 space-y-4 flex flex-col">
                                <h2 className="text-xl font-bold text-primary">{post.title}</h2>

                                {post.mediaUrl && (
                                    <div className="relative max-w-full max-h-[200px] mx-auto rounded-xl overflow-hidden border cursor-pointer hover:opacity-90 transition-opacity">
                                        {post.postType === 'image' ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={post.mediaUrl}
                                                alt="Post media"
                                                className="object-cover w-full h-full"
                                                loading="lazy"
                                                onClick={() => setSelectedMedia({ url: post.mediaUrl!, type: post.postType })}
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

                            <Dialog open={commentOpen} onOpenChange={setCommentOpen}>
                                <DialogContent className="max-h-[80vh] flex flex-col">
                                    <DialogHeader>
                                        <DialogTitle>Comments</DialogTitle>
                                    </DialogHeader>
                                    <div className="flex-1 overflow-y-auto space-y-4">
                                        {isLoadingComments ? (
                                            <div className="flex justify-center items-center h-full">
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                            </div>
                                        ) : (
                                            comments.map((comment) => (
                                                <div key={comment.id} className="flex gap-4 items-start group">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={comment.author.image} />
                                                        <AvatarFallback>
                                                            {comment.author.name?.[0] || 'U'}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-medium">{comment.author.name || 'User'}</p>
                                                            <span className="text-xs text-muted-foreground">
                                                                {formatDistanceToNow(new Date(comment.createdAt))}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm">{comment.content}</p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    <form onSubmit={handleSubmit(handleCommentSubmit)} className="pt-4 border-t">
                                        <div className="flex gap-2">
                                            <Input
                                                {...register('content', { required: true })}
                                                placeholder="Add a comment..."
                                                className="flex-1"
                                            />
                                            <Button type="submit" size="sm">
                                                Post
                                            </Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>

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
                                        onClick={() => {
                                            setSelectedPostId(post.id);
                                            fetchComments(post.id);
                                            setCommentOpen(true);
                                        }}
                                    >
                                        <MessageCircleIcon className="w-4 h-4 mr-2" />
                                        {post.comments?.length || 0}
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