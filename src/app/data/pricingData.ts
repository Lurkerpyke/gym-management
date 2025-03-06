export interface PricingPlan {
    name: string;
    price: string;
    features: string[];
}

const pricingPlans: PricingPlan[] = [
    {
        name: "Básico",
        price: "R$49",
        features: ["Gerenciamento de Membros", "Agendamento de Aulas", "Relatórios Básicos"],
    },
    {
        name: "Profissional",
        price: "R$99",
        features: ["Todas as Funcionalidades Básicas", "Relatórios Avançados", "Pagamentos Integrados"],
    },
    {
        name: "Empresarial",
        price: "Custom",
        features: ["Todas as Funcionalidades Pro", "Suporte Dedicado", "Integrações Personalizadas"],
    },
];

export default pricingPlans;
