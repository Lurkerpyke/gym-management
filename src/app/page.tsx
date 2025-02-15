import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Hero Section */}
      <section className="w-full relative">
        <div className="absolute inset-0 z-0">
          <Image
            src="/placeholder.svg"
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
                Manage Your Gym with Ease
              </h1>
              <p className="mx-auto max-w-[700px] text-white/90 md:text-xl">
                Streamline operations, boost member engagement, and grow your fitness business with GymPro.
              </p>
            </div>
            <div className="space-x-4">
              <Button className="bg-primary-foreground text-secondary-foreground hover:bg-white/90 hover:text-primary">Get Started</Button>
              <Button className="bg-primary-foreground text-secondary-foreground border-white hover:bg-white hover:text-primary m-0">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {["Member Management", "Class Scheduling", "Billing & Payments"].map((feature, index) => (
              <Card key={index} className="flex flex-col items-center text-center">
                <CardHeader>
                  <CardTitle>{feature}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Efficiently manage all aspects of your gym with our intuitive tools.</p>
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
            Our Classes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Power Lifting",
                instructor: "Mike Strong",
                schedule: "Mon, Wed, Fri",
                description: "Build strength and power with professional guidance",
                image: "/placeholder.svg"
              },
              {
                name: "Yoga Flow",
                instructor: "Sarah Peace",
                schedule: "Tue, Thu, Sat",
                description: "Find balance and flexibility through mindful movement",
                image: "/placeholder.svg"
              },
              {
                name: "HIIT Training",
                instructor: "Jack Swift",
                schedule: "Mon, Wed, Fri",
                description: "High-intensity interval training for maximum results",
                image: "/placeholder.svg"
              },
              {
                name: "Spin Class",
                instructor: "Emma Ride",
                schedule: "Tue, Thu, Sat",
                description: "Cardio-intensive indoor cycling sessions",
                image: "/placeholder.svg"
              },
              {
                name: "CrossFit",
                instructor: "Alex Power",
                schedule: "Mon to Sat",
                description: "Varied functional movements performed at high intensity",
                image: "/placeholder.svg"
              },
              {
                name: "Boxing",
                instructor: "Tony Punch",
                schedule: "Mon, Wed, Fri",
                description: "Learn boxing techniques and improve your fitness",
                image: "/placeholder.svg"
              }
            ].map((classItem, index) => (
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
                    <p className="font-medium">Instructor: {classItem.instructor}</p>
                    <p className="text-sm text-muted-foreground">Schedule: {classItem.schedule}</p>
                    <p className="text-sm">{classItem.description}</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Book Class</Button>
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
            What Our Clients Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: "John Doe",
                role: "Gym Owner",
                quote: "GymPro has revolutionized how we manage our gym. It's a game-changer!",
              },
              {
                name: "Jane Smith",
                role: "Fitness Trainer",
                quote: "The class scheduling feature saves me hours every week. Highly recommended!",
              },
            ].map((testimonial, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>"{testimonial.quote}"</p>
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
            Pricing Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Basic", price: "$49", features: ["Member Management", "Class Scheduling", "Basic Reporting"] },
              {
                name: "Pro",
                price: "$99",
                features: ["All Basic Features", "Advanced Reporting", "Integrated Payments"],
              },
              {
                name: "Enterprise",
                price: "Custom",
                features: ["All Pro Features", "Dedicated Support", "Custom Integrations"],
              },
            ].map((plan, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription className="text-2xl font-bold">{plan.price}/mo</CardDescription>
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
                  <Button className="w-full">Choose Plan</Button>
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
                Ready to Transform Your Gym?
              </h2>
              <p className="mx-auto max-w-[600px] text-primary-foreground/90 md:text-xl">
                Join thousands of satisfied gym owners and start optimizing your business today.
              </p>
            </div>
            <div className="space-x-4">
              <Button className="bg-background text-primary hover:bg-background/90" variant="outline">Start Free Trial</Button>
              <Button
                variant="outline"
                className="bg-background text-primary hover:bg-background/90"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
