// app/api/posts/[postId]/comments/route.ts
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';


export async function GET(
    request: Request,
    { params }: { params: { postId: string } }
) {
    try {
        const comments = await prisma.comment.findMany({
            where: { postId: params.postId },
            include: { author: { select: { name: true, image: true } } },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(comments);
    } catch (error) {
        console.error("Error fetching comments:", error);
        return NextResponse.json(
            { error: 'Failed to fetch comments' },
            { status: 500 }
        );
    }
}

export async function POST(
    request: Request,
    { params }: { params: { postId: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { content } = await request.json();

        const newComment = await prisma.comment.create({
            data: {
                content,
                postId: params.postId,
                authorId: session.user.id
            },
            include: { author: { select: { id: true, name: true, image: true } } } // Add this
        });

        return NextResponse.json(newComment, { status: 201 });
    } catch (error) {
        console.error("Error creating comment:", error);
        return NextResponse.json(
            { error: 'Failed to create comment' },
            { status: 500 }
        );
    }
}
