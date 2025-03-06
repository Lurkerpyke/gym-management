export interface Testimonial {
    name: string;
    role: string;
    quote: string;
}

const testimonials: Testimonial[] = [
    {
        name: "Ana Beatriz",
        role: "Proprietário da Academia",
        quote: "O GymPro revolucionou a maneira como gerenciamos nossa academia. É um divisor de águas.!",
    },
    {
        name: "Emilly Leticia",
        role: "Personal Trainer",
        quote: "A funcionalidade de agendamento de aulas me economiza horas todas as semanas. Altamente recomendada.!",
    },
];

export default testimonials;
