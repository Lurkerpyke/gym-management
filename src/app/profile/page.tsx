import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Weight, Info, Scale, Activity, CalendarCheck, User, Ruler, Calculator, Calendar, HeartPulse, Trophy, Dumbbell, LayoutDashboard, Newspaper } from "lucide-react";
import UpdateMetricsDrawer from "@/components/UpdateMetricsDrawer";
import { redirect } from "next/navigation";
import WorkoutSessionDrawer from '@/components/WorkoutSessionDrawer';
import DeleteSessionButton from "@/components/ui/DeleteSessionButton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getBmiStatus } from "../../../utils/bmi";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import CompleteSessionButton from "@/components/CompleteSessionButton";
import { NotificationSystem } from "@/components/Notifications";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return redirect("/signin");
    }


    const metrics = await prisma.userMetrics.findUnique({
        where: { userId: session.user.id },
    });

    const sessions = await prisma.workoutSession.findMany({
        where: { userId: session.user.id },
        orderBy: { date: "asc" },
    });

    const bmiStatus = metrics?.bmi ? getBmiStatus(metrics.bmi) : null

    const now = new Date()
    const upcomingSessions = sessions
        .filter(session => !session.completed && new Date(session.date) > now)
        .map(session => ({
            id: session.id,
            title: session.title,
            date: session.date
        }))

    return (
        <div className="container mx-auto p-4 space-y-6">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center gap-6 justify-between px-4">
                <div className="flex flex-col md:flex-row items-center gap-5">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={session.user.image || ""} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            <User className="h-12 w-12" />
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1 text-center md:text-left">
                        <h1 className="text-2xl font-bold">{session.user.name}</h1>
                        <p className="text-muted-foreground">{session.user.email}</p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                    <NotificationSystem sessions={upcomingSessions} />
                    {session.user.role === "owner" && (
                        <Button variant="outline" asChild>
                            <Link href="/owner">
                                <LayoutDashboard className="h-4 w-4" />
                                Owner Dashboard
                            </Link>
                        </Button>
                    )}
                    <Button variant="outline" asChild>
                        <Link href="/posts">
                            <Newspaper className="h-4 w-4" />
                            Posts
                        </Link>
                    </Button>
                </div>
            </div>

            <Separator className="my-6" />

            {/* Fitness Metrics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Height</CardTitle>
                        <Ruler className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {metrics?.height ? `${metrics.height}m` : "N/A"}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div className="flex items-center gap-1">
                            <CardTitle className="text-sm font-medium">BMI</CardTitle>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Info className="h-3 w-3 text-muted-foreground" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="space-y-1">
                                            <p className="font-medium">BMI Categories:</p>
                                            <p>Underweight: &lt; 18.5</p>
                                            <p>Normal weight: 18.5 – 24.9</p>
                                            <p>Overweight: 25 – 29.9</p>
                                            <p>Obesity: ≥ 30</p>
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <Calculator className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {metrics?.bmi ? (
                            <div className={`text-2xl font-bold ${bmiStatus?.color}`}>
                                {metrics.bmi.toFixed(1)}
                                <span className="text-sm ml-2 font-normal text-muted-foreground">
                                    ({bmiStatus?.status})
                                </span>
                            </div>
                        ) : (
                            <div className="text-2xl font-bold">N/A</div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Waist</CardTitle>
                        <Scale className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {metrics?.waistCircumference ? `${metrics.waistCircumference}cm` : "N/A"}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hip</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {metrics?.hipCircumference ? `${metrics.hipCircumference}cm` : "N/A"}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Weight</CardTitle>
                        <Weight className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {metrics?.currentWeight ? `${metrics.currentWeight}Kg` : "N/A"}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Última medição</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {new Date(metrics?.lastMeasurement ? `${metrics.lastMeasurement}` : "N/A").toLocaleString()}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Body Analysis</CardTitle>
                        <HeartPulse className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Fat/Muscle Ratio</span>
                            <span>
                                {metrics?.bodyFat || 0}% / {metrics?.muscleMass || 0}%
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Waist-Hip Ratio</span>
                            <span>
                                {metrics?.waistCircumference && metrics?.hipCircumference
                                    ? (metrics.waistCircumference / metrics.hipCircumference).toFixed(2)
                                    : 'N/A'}
                            </span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-col md:flex-row gap-3 items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Recent Achievements</CardTitle>
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <div className="flex flex-col items-center">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Dumbbell className="h-5 w-5 text-primary" />
                                </div>
                                <span className="text-xs mt-1">{sessions.length} Workouts</span>
                            </div>
                            {/* Add more achievements */}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <UpdateMetricsDrawer metrics={metrics} />


            {/* Workout Schedule Section */}
            <Card>
                <CardHeader className="flex flex-col md:flex-row gap-3 items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Proximos treinos</CardTitle>
                    <div className="flex items-center gap-2 flex-col md:flex-row">
                        <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                        <WorkoutSessionDrawer />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {sessions.map((session) => (
                            <div key={session.id} className={'flex items-center justify-between p-2 rounded hover:bg-muted transition-colors'}
                            style={{ backgroundColor: `hsl(var(${session.completed ? '--session-completed' :'--session-pending'}) / 50%)` }}>
                                <div>
                                    <p className="font-medium">{session.title}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {new Date(session.date).toLocaleString()}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Duration: {session.duration} minutes
                                    </p>
                                </div>
                                <div className="flex gap-2 flex-col md:flex-row">
                                    <CompleteSessionButton
                                        sessionId={session.id}
                                        completed={session.completed}
                                    />
                                    <WorkoutSessionDrawer session={session} />
                                    <DeleteSessionButton sessionId={session.id} />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Health Tips</CardTitle>
                    <Info className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    {metrics?.bmi && (
                        <div className="text-sm space-y-2">
                            {['Obese', 'Overweight'].includes(bmiStatus?.status || '') && (
                                <p>💡 Para reduzir o excesso de peso, combine 150 minutos semanais de cardio moderado com sessões de treino de força. Considere também HIIT para maximizar os resultados. Consulte um profissional antes de iniciar qualquer programa intensivo</p>
                            )}
                            {bmiStatus?.status === 'Normal weight' && (
                                <p>💡 Seu IMC está ideal. Continue com uma dieta equilibrada e exercícios regulares para manter a saúde e a performance física. monitore regularmente seus indicadores de saúde</p>
                            )}
                            {bmiStatus?.status === 'Underweight' && (
                                <p>💡 Se estiver abaixo do peso, invista em refeições nutritivas e densas em calorias, associadas a treinos de resistência. Consultar um nutricionista pode ajudar a desenvolver um plano personalizado. verifique com um médico se a baixa massa corporal não está relacionada a condições de saúde subjacentes</p>
                            )}
                            {metrics.muscleMass !== null && metrics.muscleMass < 30 && (
                                <p>💪 Para melhorar sua massa muscular, inclua treinos de resistência pelo menos 2x/semana, focando em progressão gradual da carga.</p>
                            )}
                            {metrics.muscleMass !== null && metrics.muscleMass < 30 && (
                                <p>💡 (Valores de referência: Homens 33-39%, Mulheres 25-31%)</p>
                            )}
                            {metrics.muscleMass !== null && metrics.muscleMass < 25 && (
                                <p>💡 Sua massa muscular está abaixo do ideal. Aumente a ingestão de proteínas e considere a orientação de um profissional de educação física para um plano de treino específico.</p>
                            )}
                            {metrics.muscleMass !== null && metrics.muscleMass < 25 && (
                                <p>💡 (Valores de referência: Homens 33-39%, Mulheres 25-31%)</p>
                            )}

                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}