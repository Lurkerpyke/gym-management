import Footer from "@/components/Footer"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { cn } from "@/lib/utils"
import { Inter } from "next/font/google"
import Header from "@/components/Header"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
    title: "GymPro - Gym Management SaaS",
    description: "Streamline your gym operations with GymPro",
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-br" suppressHydrationWarning>
            <body className={cn("min-h-screen bg-background font-sans antialiased relative", inter.className)}>
                <Header />
                <SidebarProvider>
                    <AppSidebar />
                    <main>
                        <SidebarTrigger />
                        {children}
                    </main>
                </SidebarProvider>
                <Footer />
            </body>
        </html>
    )
}