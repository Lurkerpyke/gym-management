'use client'
import { motion } from "framer-motion";
import { LampContainer } from "@/components/ui/lamp";

const HeroAbout = () => {
    return (
        <section className="relative w-full h-screen">
            <LampContainer className="h-full">
                <motion.div
                    initial={{ opacity: 0.5, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: 0.3,
                        duration: 0.8,
                        ease: "easeInOut",
                    }}
                    className="flex flex-col justify-between items-center w-full px-4"
                >
                    <div className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 mb-4 md:mb-6 text-center 
               pb-1 leading-[1.2] px-2 bg-[length:100%_150%] bg-center">
                        Redefining Fitness Excellence
                    </div>
                    <div className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto text-center leading-snug">
                        Since 2012, we've transformed 50,000+ lives through science-backed training and community support
                    </div>
                </motion.div>
            </LampContainer>
        </section>
    )
}

export default HeroAbout