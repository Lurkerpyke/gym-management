// app/(routes)/unauthorized/page.tsx

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft, ArrowRight, CheckCircle2, Mail } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <Card className="w-full max-w-md shadow-lg rounded-2xl border-0">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center text-red-500 mb-6">
                        <AlertTriangle className="h-16 w-16" />
                    </div>
                    <h1 className="text-3xl font-bold text-center text-slate-800">
                        Acesso restrito
                    </h1>
                </CardHeader>

                <CardContent className="space-y-4">
                    <p className="text-slate-600 text-center">
                        Você não tem permissão para vizualisar essa página. Essa area é restrita apenas para membros ou staf da empresa.
                    </p>

                    <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                        <div className="flex items-center space-x-2 text-emerald-600">
                            <CheckCircle2 className="h-4 w-4" />
                            <span className="text-sm">Possiveis motivos:</span>
                        </div>
                        <ul className="list-disc pl-6 text-sm text-slate-600 space-y-1">
                            <li>Sua conta não possui privilégio de admin</li>
                            <li>Você ainda não é um membro da academia</li>
                            <li>Sua seção expirou, faça login novamente</li>
                        </ul>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-3">
                    <Button asChild className="w-full" variant="default">
                        <Link href="/" className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Retorne para o inicio
                        </Link>
                    </Button>
                    <Button asChild className="w-full" variant="default">
                        <Link href="/signin" className="gap-2">
                            <ArrowRight className="h-4 w-4" />
                            Faça login
                        </Link>
                    </Button>

                    <div className="text-center text-sm text-slate-600 mt-4">
                        Encontrou algum erro?{" "}
                        <Link
                            href="leandro.soares.eneterio@gmail.com"
                            className="text-blue-600 hover:underline flex items-center justify-center gap-1"
                        >
                            <Mail className="h-4 w-4" />
                            Contato para suporte
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}