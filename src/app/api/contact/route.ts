export async function POST(request: Request) {
    const data = await request.json();

    // Add your email sending logic here
    // Example: Send email using Resend, Nodemailer, etc.

    return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
}