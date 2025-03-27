import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Dumbbell, Trophy, HeartPulse, CalendarCheck } from "lucide-react";
import Image from "next/image";
import HeroAbout from "./components/HeroAbout";

export default function AboutPage() {
    const features = [
        {
            icon: <Dumbbell className="w-8 h-8" />,
            title: "Equipamentos de Alto Nível",
            description: "500+ equipamentos de última geração distribuídos em 10 áreas especializadas"
        },
        {
            icon: <Trophy className="w-8 h-8" />,
            title: "Treinadores Especializados",
            description: "Mais de 50 profissionais certificados com histórico comprovado de sucesso"
        },
        {
            icon: <HeartPulse className="w-8 h-8" />,
            title: "Bem-Estar Holístico",
            description: "Integração de programas de condicionamento físico, nutrição e saúde mental"
        },
    ];

    const team = [
        {
            name: "Marcus Johnson",
            role: "Treinador-Chefe",
            bio: "Mais de 15 anos de experiência em treinamento de força",
            image: "/Marcus.webp"
        },
        {
            name: "Sarah Chen",
            role: "Especialista em Nutrição",
            bio: "Nutricionista registrada e especialista em nutrição esportiva",
            image: "/sarah.webp"
        },
        {
            name: "Emily Letícia",
            role: "Mestre em Yoga",
            bio: "Mais de 5000 horas de experiência em ensino",
            image: "/emily.webp"
        },
    ];

    return (
        <div className="space-y-20 pb-20 flex flex-col items-center">
            {/* Seção do Herói Modificada com Efeito de Iluminação */}
            <HeroAbout />

            {/* Seção da História da Academia */}
            <section className="container grid md:grid-cols-2 gap-12 items-center px-5">
                <div className="space-y-6 flex flex-col items-center md:items-start">
                    <h2 className="text-3xl font-bold">Nossa Filosofia de Fitness</h2>
                    <p className="text-muted-foreground text-lg">
                        Na <span className="italic font-bold">GymPro</span>, acreditamos que a verdadeira forma física deve ser sustentável, personalizada e empoderadora.
                        Nossa instalação de 300 metros quadrados foi projetada com um único objetivo: criar um ecossistema onde
                        cada membro se sinta apoiado em sua jornada única.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 rounded-xl bg-primary/10">
                            <h3 className="text-2xl font-bold text-primary">100+</h3>
                            <p className="text-muted-foreground">Membros Ativos</p>
                        </div>
                        <div className="p-6 rounded-xl bg-secondary/10">
                            <h3 className="text-2xl font-bold text-secondary-foreground">200+</h3>
                            <p className="text-muted-foreground">Aulas Semanais</p>
                        </div>
                    </div>
                </div>
                <div className="relative aspect-video rounded-2xl overflow-hidden">
                    <Image
                        src="/gymholder.webp"
                        alt="Interior da Academia"
                        fill
                        className="object-cover"
                    />
                </div>
            </section>

            {/* Seção de Diferenciais */}
            <section className="container space-y-12">
                <h2 className="text-3xl font-bold text-center">Por Que a <span className="font-bold italic">GymPro</span> se Destaca</h2>
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

            {/* Seção de Equipe */}
            <section className="container space-y-12">
                <h2 className="text-3xl font-bold text-center">Conheça Nossa Liderança</h2>
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

            {/* Seção de Valores */}
            <section className="container bg-secondary/10 rounded-2xl p-12">
                <div className="max-w-4xl mx-auto space-y-8 text-center">
                    <CalendarCheck className="w-12 h-12 mx-auto text-primary" />
                    <h2 className="text-3xl font-bold">Nosso Compromisso</h2>
                    <p className="text-xl text-primary">
                        Cada membro recebe um plano de sucesso personalizado de 12 semanas, incluindo:
                    </p>
                    <div className="grid md:grid-cols-4 gap-4">
                        {['Análise Biométrica', 'Treinos Personalizados', 'Planejamento Nutricional', 'Acompanhamento de Progresso'].map((item) => (
                            <div key={item} className="p-4 bg-background rounded-lg border border-primary text-center flex justify-center items-center">
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
