import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import features, { Feature } from "@/app/data/featuresData"
import testimonials, { Testimonial } from "./data/testimonialsData"
import gymClasses, { GymClass } from "./data/classesData"
import pricingPlans, { PricingPlan } from "./data/pricingData"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen max-w-[100vw] overflow-x-hidden">
      {/* Hero Section */}
      <section className="w-full relative h-[100vh]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero.jpg"
            alt="Gym interior"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
          <div className="absolute inset-0 bg-black/60" /> {/* Overlay for better text visibility */}
        </div>
        <div className="relative z-10 container mx-auto px-4 py-24 md:py-32 lg:py-40">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                Gerencie sua academia com facilidade
              </h1>
              <p className="mx-auto max-w-[700px] text-white/90 md:text-xl">
                Simplifique as operações, aumente o engajamento dos membros e faça seu negócio de fitness crescer com o GymPro.
              </p>
            </div>
            <div className="flex flex-col md:flex-row md:space-x-10 justify-center items-center gap-4 text-center">
              <Button className="bg-primary-foreground text-secondary-foreground hover:bg-white/90 hover:text-primary">Comece agora</Button>
              <Button className="bg-primary-foreground text-secondary-foreground border-white hover:bg-white hover:text-primary" asChild>
                <Link href="/about">
                  Saiba mais
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">Benefícios</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature: Feature, index: number) => (
              <Card key={index} className="flex flex-col items-center text-center">
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Classes Section */}
      <section className="w-full py-12 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
            Nossas Aulas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gymClasses.map((classItem: GymClass, index: number) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader>
                  <div className="h-48 relative mb-4">
                    <Image
                      src={classItem.image}
                      alt={classItem.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <CardTitle>{classItem.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="font-medium">Instrutor: {classItem.instructor}</p>
                    <p className="text-sm text-muted-foreground">Horário: {classItem.schedule}</p>
                    <p className="text-sm">{classItem.description}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Agendar Aula</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* Testimonials Section */}
      <section className="w-full py-12 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
            O que nossos cliente dizem
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial: Testimonial, index: number) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>&quot;{testimonial.quote}&quot;</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full py-12 md:py-24 bg-muted" id="pricing">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
            Planos de Preços
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pricingPlans.map((plan: PricingPlan, index: number) => (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription className="text-2xl font-bold">{plan.price}/mês</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle2 className="mr-2 h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Escolher Plano</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Pronto para Transformar Sua Academia?
              </h2>
              <p className="mx-auto max-w-[600px] text-primary-foreground/90 md:text-xl">
                Junte-se a milhares de proprietários de academias satisfeitos e comece a otimizar seu negócio hoje mesmo.
              </p>
            </div>
            <div className="space-x-4">
              <Button className="bg-background text-primary hover:bg-background/90" variant="outline">Comece Grátis</Button>
              <Button
                variant="outline"
                className="bg-background text-primary hover:bg-background/90"
              >
                Entrar em Contato
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
