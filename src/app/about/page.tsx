import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Trophy, Clock, Users, HeartPulse, CalendarCheck } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
    const features = [
        {
            icon: <Dumbbell className="w-8 h-8" />,
            title: "World-Class Equipment",
            description: "500+ pieces of cutting-edge equipment across 10 specialized zones"
        },
        {
            icon: <Trophy className="w-8 h-8" />,
            title: "Expert Trainers",
            description: "50+ certified professionals with proven success records"
        },
        {
            icon: <HeartPulse className="w-8 h-8" />,
            title: "Holistic Wellness",
            description: "Combining fitness, nutrition, and mental health programs"
        },
    ];

    const team = [
        {
            name: "Marcus Johnson",
            role: "Head Coach",
            bio: "15+ years experience in strength training",
            image: "/Marcus.webp"
        },
        {
            name: "Sarah Chen",
            role: "Nutrition Specialist",
            bio: "Registered dietitian & sports nutrition expert",
            image: "/sarah.webp"
        },
        {
            name: "Emily Letícia",
            role: "Yoga Master",
            bio: "5000+ hours of teaching experience",
            image: "/emily.webp"
        },
    ];

    return (
        <div className="space-y-20 pb-20">
            {/* Hero Section */}
            <section className="relative h-[70vh] flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 dark:from-primary/10 dark:to-primary/5" />
                <div className="relative z-10 text-center space-y-6 px-4 max-w-4xl">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                        Redefining Fitness Excellence
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Since 2012, we've transformed 50,000+ lives through science-backed training and community support
                    </p>
                </div>
            </section>

            {/* Gym Story Section */}
            <section className="container grid md:grid-cols-2 gap-12 items-center px-5">
                <div className="space-y-6 flex flex-col items-center md:items-start">
                    <h2 className="text-3xl font-bold">Our Fitness Philosophy</h2>
                    <p className="text-muted-foreground text-lg">
                        At EliteFit, we believe true fitness is sustainable, personalized, and empowering.
                        Our 50,000 sq.ft facility was designed with one goal - to create an ecosystem where
                        every member feels supported in their unique journey.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 rounded-xl bg-primary/10">
                            <h3 className="text-2xl font-bold text-primary">10K+</h3>
                            <p className="text-muted-foreground">Active Members</p>
                        </div>
                        <div className="p-6 rounded-xl bg-secondary/10">
                            <h3 className="text-2xl font-bold text-secondary-foreground">200+</h3>
                            <p className="text-muted-foreground">Weekly Classes</p>
                        </div>
                    </div>
                </div>
                <div className="relative aspect-video rounded-2xl overflow-hidden">
                    <Image
                        src="/gymholder.webp"
                        alt="Gym Interior"
                        fill
                        className="object-cover"
                    />
                </div>
            </section>

            {/* Features Section */}
            <section className="container space-y-12">
                <h2 className="text-3xl font-bold text-center">Why EliteFit Stands Out</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow h-full">
                            <CardHeader className="items-center">
                                <div className="p-4 rounded-full bg-primary/10 text-primary">
                                    {feature.icon}
                                </div>
                            </CardHeader>
                            <CardContent className="text-center">
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground">{feature.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Team Section */}
            <section className="container space-y-12">
                <h2 className="text-3xl font-bold text-center">Meet Our Leadership</h2>
                <div className="grid md:grid-cols-3 gap-8 px-5">
                    {team.map((member, index) => (
                        <Card key={index} className="group overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="relative aspect-square">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <CardContent className="p-6">
                                <h3 className="text-xl font-bold">{member.name}</h3>
                                <p className="text-primary mb-2">{member.role}</p>
                                <p className="text-sm text-muted-foreground">{member.bio}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            {/* Values Section */}
            <section className="container bg-secondary/10 rounded-2xl p-12">
                <div className="max-w-4xl mx-auto space-y-8 text-center">
                    <CalendarCheck className="w-12 h-12 mx-auto text-primary" />
                    <h2 className="text-3xl font-bold">Our Commitment</h2>
                    <p className="text-xl text-muted-foreground">
                        Every member receives a personalized 12-week success plan including:
                    </p>
                    <div className="grid md:grid-cols-4 gap-4">
                        {['Biometric Analysis', 'Custom Workouts', 'Nutrition Planning', 'Progress Tracking'].map((item) => (
                            <div key={item} className="p-4 bg-background rounded-lg border border-blue-500">
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}