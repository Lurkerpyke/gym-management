// app/(routes)/contact/page.tsx

'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Send, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import dynamic from 'next/dynamic';

// Dynamically import Map component to avoid SSR issues
const Map = dynamic(
    () => import('@/components/map').then((mod) => mod.Map),
    {
        ssr: false,
        loading: () => <p className="text-[hsl(var(--muted-foreground))]">Loading map...</p>
    }
);

export default function ContactPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                body: JSON.stringify(Object.fromEntries(formData)),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setIsSubmitted(true);
                (e.target as HTMLFormElement).reset();
            }
        } catch (error) {
            console.error('Submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background))] p-4">
            <Card className="w-full max-w-4xl shadow-xl rounded-xl border-0 bg-[hsl(var(--card))]">
                <CardHeader className="text-center space-y-2">
                    <h1 className="text-4xl font-bold text-[hsl(var(--foreground))]">
                        Get in Touch
                    </h1>
                    <p className="text-lg text-[hsl(var(--muted-foreground))]">
                        We're here to help you achieve your fitness goals
                    </p>
                </CardHeader>

                <CardContent className="grid md:grid-cols-2 gap-8 p-6">
                    {/* Contact Information */}
                    <div className="space-y-6">
                        <div className="flex flex-col md:flex-row items-start gap-4">
                            <div className="p-3 rounded-full bg-[hsl(var(--primary))]/10">
                                <Phone className="h-6 w-6 text-[hsl(var(--primary))]" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">
                                    Phone Support
                                </h3>
                                <Link
                                    href="tel:+15551234567"
                                    className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors"
                                >
                                    +1 (555) 123-4567
                                </Link>
                                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                    Mon-Fri: 8am - 8pm EST
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-start gap-4">
                            <div className="p-3 rounded-full bg-[hsl(var(--primary))]/10">
                                <Mail className="h-6 w-6 text-[hsl(var(--primary))]" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">
                                    Email Us
                                </h3>
                                <Link
                                    href="mailto:support@gymforge.com"
                                    className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors"
                                >
                                    support@gymforge.com
                                </Link>
                                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                    Typically reply within 24 hours
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-start gap-4">
                            <div className="p-3 rounded-full bg-[hsl(var(--primary))]/10">
                                <MapPin className="h-6 w-6 text-[hsl(var(--primary))]" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">
                                    Visit Us
                                </h3>
                                <p className="text-[hsl(var(--muted-foreground))]">
                                    123 Fitness Street<br />
                                    New York, NY 10001
                                </p>
                            </div>
                        </div>

                        {/* Map Integration */}
                        <div className="rounded-lg overflow-hidden h-48 border border-[hsl(var(--border))]">
                            <Map
                                position={[-8.361569, -35.763336]} // NYC coordinates
                                zoom={15}
                                className="h-48 w-full"
                            />
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="space-y-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[hsl(var(--foreground))]">
                                    Name
                                </label>
                                <Input
                                    name="name"
                                    placeholder="Enter your name"
                                    className="bg-[hsl(var(--background))]"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[hsl(var(--foreground))]">
                                    Email
                                </label>
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    className="bg-[hsl(var(--background))]"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[hsl(var(--foreground))]">
                                    Subject
                                </label>
                                <Input
                                    name="subject"
                                    placeholder="How can we help?"
                                    className="bg-[hsl(var(--background))]"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-[hsl(var(--foreground))]">
                                    Message
                                </label>
                                <Textarea
                                    name="message"
                                    placeholder="Type your message here..."
                                    rows={5}
                                    className="bg-[hsl(var(--background))]"
                                    required
                                />
                            </div>

                            <Button
                                className="w-full gap-2"
                                type="submit"
                                disabled={isSubmitting}
                            >
                                <Send className="h-4 w-4" />
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </Button>
                        </form>

                        {/* Success Message (conditional) */}
                        {isSubmitted && (
                            <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/50 flex items-center gap-3">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                <p className="text-emerald-600 dark:text-emerald-400 text-sm">
                                    Your message has been successfully sent!
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="border-t border-[hsl(var(--border))] p-6">
                    <div className="w-full text-center text-sm text-[hsl(var(--muted-foreground))]">
                        © {new Date().getFullYear()} GymForge. All rights reserved.
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}