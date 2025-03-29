import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Activity, AlertCircle, Bell, Dumbbell, LayoutDashboard, Users } from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { QuickActionButton } from "@/components/QuickActionButton";
import { ActivityItem } from "@/components/ActivityItem";
import { ActivityLog } from "@prisma/client";

type ActivityWithUser = ActivityLog & {
    user: {
        name: string | null;
        image: string | null;
    };
};

export default async function OwnerPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== 'owner') {
        return redirect("/unauthorized");
    }

    // Get statistics for the dashboard
    const [
        userCount,
        activeUsers,
        newRegistrations,
        workoutStats,
        recentActivities,
        systemHealth
    ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({
            where: {
                workoutSessions: {
                    some: {
                        completed: true
                    }
                }
            }
        }),
        prisma.user.count({
            where: {
                createdAt: {
                    gte: new Date(new Date().setDate(new Date().getDate() - 7))
                }
            }
        }),
        prisma.workoutSession.aggregate({
            _avg: { duration: true },
            _sum: { duration: true }
        }),
        prisma.activityLog.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { name: true, image: true }
                }
            }
        }) as Promise<ActivityWithUser[]>,
        prisma.$queryRaw<{ status: number }[]>`SELECT 1 as status`
    ]);

    return (
        <div className="container mx-auto p-4 space-y-6">
            {/* Cabeçalho do Dashboard */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={session.user.image || ""} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            <LayoutDashboard className="h-8 w-8" />
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-2xl font-bold">Owner Dashboard</h1>
                        <p className="text-muted-foreground">Bem-vindo de volta, {session.user.name}!</p>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                    <Button variant="outline" asChild>
                        <Link href="/owner/users">
                            <Users className="mr-2 h-4 w-4" />
                            Gerenciar Usuários
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/posts">
                            <Bell className="h-4 w-4" />
                            Enviar Anúncio
                        </Link>
                    </Button>
                </div>
            </div>

            <Separator className="my-6" />

            {/* Grade de Métricas Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{userCount}</div>
                        <p className="text-xs text-muted-foreground">
                            +{newRegistrations} novos esta semana
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sessões Ativas</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeUsers}</div>
                        <p className="text-xs text-muted-foreground">
                            Clientes que realizaram exercícios recentemente
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Estatísticas de Treinamento</CardTitle>
                        <Dumbbell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {workoutStats._avg.duration || 0} mins média
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {workoutStats._sum.duration || 0} minutos totais
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Saúde do Sistema</CardTitle>
                        {systemHealth ? (
                            <div className="h-4 w-4 rounded-full bg-green-500" />
                        ) : (
                            <AlertCircle className="h-4 w-4 text-destructive" />
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {systemHealth ? 'Todos os sistemas normais' : 'Problemas detectados'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Conexão com o banco de dados: {systemHealth ? 'Ativa' : 'Inativa'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Seção de Atividade Recente */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Atividades Recentes
                    </CardTitle>
                </CardHeader>
                <CardContent className="divide-y">
                    {recentActivities.map((activity) => (
                        <ActivityItem
                            key={activity.id}
                            activity={activity}
                        />
                    ))}
                    {recentActivities.length === 0 && (
                        <div className="p-4 text-center text-muted-foreground">
                            Nenhuma atividade recente
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Cartão de Ações Rápidas */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <LayoutDashboard className="h-5 w-5" />
                        Ações Rápidas
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <QuickActionButton
                        icon="users"
                        label="Adicionar Usuário"
                        actionType="add-user"
                    />
                    <QuickActionButton
                        icon="bell"
                        label="Enviar Notificação"
                        actionType="send-notification"
                    />
                    <QuickActionButton
                        icon="activity"
                        label="Gerar Relatório"
                        actionType="generate-report"
                    />
                    <QuickActionButton
                        icon="alertCircle"
                        label="Configurações"
                        actionType="system-settings"
                    />
                </CardContent>
            </Card>
        </div>
    );

}