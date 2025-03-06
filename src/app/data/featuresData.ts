export interface Feature {
    title: string;
    description: string;
}

const features: Feature[] = [
    {
        title: "Gerenciamento de Alunos",
        description:
            "Mantenha um controle completo dos alunos da academia, incluindo cadastro, informações pessoais, planos de treino, histórico de presença e progresso. O sistema permite organizar os alunos de forma eficiente, garantindo um acompanhamento personalizado e melhorando a experiência dentro da academia.",
    },
    {
        title: "Agendamento de Aulas",
        description:
            "Facilite o agendamento de aulas coletivas e treinos individuais com um sistema intuitivo e automatizado. Os alunos podem reservar horários disponíveis, enquanto os instrutores podem gerenciar turmas, evitando lotações e garantindo uma organização eficiente da agenda da academia.",
    },
    {
        title: "Faturamento e Pagamentos",
        description:
            "Automatize a gestão financeira da academia com um módulo de faturamento completo. Controle mensalidades, pacotes de treinos, vencimentos e pagamentos de forma simples e segura. Ofereça diferentes métodos de pagamento e acompanhe o fluxo de caixa para manter a saúde financeira do negócio.",
    },
];

export default features;
