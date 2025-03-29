// app/api/posts/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
    try {
        const posts = await prisma.post.findMany({
            include: {
                author: {
                    select: {
                        name: true,
                        image: true
                    }
                },
                comments: true  // Move inside the include object
            },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        return NextResponse.json(
            { error: 'Failed to fetch posts' },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    // Validate session and user role
    if (!session || !session.user) {
        return NextResponse.json(
            { error: 'Unauthorized - No session found' },
            { status: 401 }
        );
    }

    if (!['owner', 'admin'].includes(session.user.role)) {
        return NextResponse.json(
            { error: 'Unauthorized - Insufficient privileges' },
            { status: 403 }
        );
    }

    try {
        const { title, content, mediaUrl, postType } = await req.json();

        // Validate required fields
        if (!title || !content) {
            return NextResponse.json(
                { error: 'Title and content are required' },
                { status: 400 }
            );
        }

        const newPost = await prisma.post.create({
            data: {
                title,
                content,
                mediaUrl: mediaUrl || null,
                postType: postType || 'text',
                authorId: session.user.id // Now guaranteed to exist
            }
        });

        return NextResponse.json(newPost, { status: 201 });
    } catch (error) {
        console.error('Post creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create post' },
            { status: 500 }
        );
    }
}