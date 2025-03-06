export interface GymClass {
    name: string;
    instructor: string;
    schedule: string;
    description: string;
    image: string;
}

const gymClasses: GymClass[] = [
    {
        name: "Levantamento de Peso",
        instructor: "Maria Carla",
        schedule: "seg, ter, qui",
        description: "Construa força e potência com orientação profissional e determinação",
        image: "/powerlift.jpg",
    },
    {
        name: "Fluxo de Yoga",
        instructor: "Sarah Vitória",
        schedule: "sex, seg, qua",
        description: "Encontre equilíbrio e flexibilidade através do movimento consciente",
        image: "/yoga.jpg",
    },
    {
        name: "Treinamento HIIT",
        instructor: "Livia Gabrielly",
        schedule: "ter, qua, qui",
        description: "Treinamento intervalado de alta intensidade para resultados máximos",
        image: "/hiit.jpg",
    },
    {
        name: "Aula de Spinning",
        instructor: "Alanna Beatriz",
        schedule: "Todos os dias",
        description: "Sessões de ciclismo indoor intensivas em cardio",
        image: "/spin.jpg",
    },
    {
        name: "CrossFit",
        instructor: "Maria Isabela",
        schedule: "ter, qui",
        description: "Movimentos funcionais variados realizados com alta intensidade",
        image: "/crossfit.jpg",
    },
    {
        name: "Box",
        instructor: "Leandro Soares",
        schedule: "qua",
        description: "Aprenda técnicas de boxe e melhore sua forma física",
        image: "/boxing.jpg",
    },
];

export default gymClasses;
