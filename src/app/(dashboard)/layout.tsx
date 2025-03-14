import Footer from "@/components/Footer"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { cn } from "@/lib/utils"
import { Inter } from "next/font/google"
import Header from "@/components/Header"
import { ThemeProvider } from "@/components/ui/theme-provider"

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
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <body className={cn("min-h-screen bg-background font-sans antialiased relative w-full overflow-x-hidden", inter.className)}>
                    <Header />
                    <SidebarProvider open={true}>
                        <AppSidebar />
                        <main className="">
                            <SidebarTrigger />
                            {children}
                        </main>
                    </SidebarProvider>
                    <Footer />
                </body>
            </ThemeProvider>
        </html>
    )
}