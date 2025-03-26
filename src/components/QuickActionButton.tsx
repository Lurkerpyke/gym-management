// components/QuickActionButton.tsx
'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Users, Bell, Activity, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";

interface ReportData {
    totalUsers: number;
    newUsersLastWeek: number;
    activeUsers: number;
    roleDistribution: Record<string, number>;
}

const iconComponents = {
    users: Users,
    bell: Bell,
    activity: Activity,
    alertCircle: AlertCircle,
} as const;

export const QuickActionButton = ({
    icon,
    label,
    actionType
}: {
    icon: keyof typeof iconComponents;
    label: string;
    actionType: 'add-user' | 'send-notification' | 'generate-report' | 'system-settings';
}) => {
    const router = useRouter();
    const IconComponent = iconComponents[icon];
    const [isGenerating, setIsGenerating] = useState(false);
    const [format, setFormat] = useState<'pdf' | 'csv'>('pdf');

    const generatePDF = async (data: ReportData) => {
        try {
            // Dynamically import PDFMake and fonts
            const pdfMake = await import('pdfmake/build/pdfmake');
            const vfsFonts = await import('pdfmake/build/vfs_fonts');
            // Merge fonts into virtual file system
            pdfMake.default.vfs = vfsFonts.default;

            pdfMake.default.fonts = {
                Roboto: {
                    normal: 'Roboto-Regular.ttf',
                    bold: 'Roboto-Medium.ttf',
                    italics: 'Roboto-Italic.ttf',
                    bolditalics: 'Roboto-MediumItalic.ttf'
                }
            };

            // PDF document definition
            const docDefinition = {
                pageOrientation: 'portrait',
                content: [
                    { text: 'Gym Management Relatório', style: 'header' },
                    { text: `Gerado em: ${new Date().toLocaleDateString()}`, style: 'subheader' },
                    { text: '\n' }, // Spacer
                    {
                        table: {
                            widths: ['*', '*'],
                            body: [
                                [
                                    { text: 'Membros Totais', style: 'tableHeader' },
                                    { text: data.totalUsers, style: 'tableValue' }
                                ],
                                [
                                    { text: 'Novos Membros (Última semana)', style: 'tableHeader' },
                                    { text: data.newUsersLastWeek, style: 'tableValue' }
                                ],
                                [
                                    { text: 'Membros ativos', style: 'tableHeader' },
                                    { text: data.activeUsers, style: 'tableValue' }
                                ]
                            ]
                        }
                    },
                    { text: '\n\n' }, // Spacer
                    {
                        text: 'Distribuição de Funções:',
                        style: 'sectionHeader'
                    },
                    {
                        ul: Object.entries(data.roleDistribution).map(([role, count]) =>
                            `${role}: ${count} membros`
                        )
                    }
                ],
                styles: {
                    header: {
                        fontSize: 24,
                        bold: true,
                        color: '#2d3748',
                        margin: [0, 0, 0, 10]
                    },
                    subheader: {
                        fontSize: 12,
                        color: '#718096',
                        margin: [0, 0, 0, 15]
                    },
                    sectionHeader: {
                        fontSize: 16,
                        bold: true,
                        color: '#2d3748',
                        margin: [0, 15, 0, 10]
                    },
                    tableHeader: {
                        bold: true,
                        fontSize: 12,
                        color: '#4a5568'
                    },
                    tableValue: {
                        fontSize: 14,
                        color: '#2d3748'
                    }
                },
                defaultStyle: {
                    font: 'Roboto'
                }
            } as any;

            // Generate PDF
            const pdfDoc = pdfMake.default.createPdf(docDefinition);
            pdfDoc.download(`gym-report-${new Date().toISOString()}.pdf`);

        } catch (error) {
            toast.error('Failed to generate PDF');
            console.error('PDF generation error:', error);
        }
    };

    const generateCSV = (data: ReportData) => {
        // Simple CSV implementation
        const csvContent = [
            ['Report Type', 'User Statistics'],
            ['Generated At', new Date().toISOString()],
            ['Total Users', data.totalUsers],
            ['New Users (Last Week)', data.newUsersLastWeek],
            ['Active Users', data.activeUsers],
            ...Object.entries(data.roleDistribution).map(([role, count]) =>
                [`Role: ${role}`, count]
            )
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gym-report-${new Date().toISOString()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const handleGenerateReport = async () => {
        setIsGenerating(true);
        try {
            const response = await fetch('/api/reports/user-stats');
            if (!response.ok) throw new Error('Failed to fetch data');
            const data = await response.json();

            // Use format state here 👇
            if (format === 'pdf') {
                generatePDF(data);
            } else {
                generateCSV(data);
            }
            toast.success('Report generated successfully');

        } catch (error) {
            toast.error('Failed to generate report');
            console.error('Report error:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAction = () => {
        switch (actionType) {
            case 'add-user':
                router.push('/owner/users/create');
                break;
            case 'send-notification':
                router.push('/owner/notifications/new');
                break;
            case 'generate-report':
                handleGenerateReport();
                break;
            case 'system-settings':
                toast.info('Configurações do sistema em desenvolvimento');
                break;
        }
    };

    return (
        <Button
            variant="outline"
            className="h-full min-h-40 flex flex-col items-center justify-center"
            onClick={handleAction}
            disabled={isGenerating}
        >
            {isGenerating ? (
                <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
                <>
                    <IconComponent className="h-6 w-6 mb-2" />
                    <div className="flex flex-col lg:flex-row gap-4">
                        <span className="text-sm">{label}</span>
                        {/* Add the select dropdown here 👇 */}
                        {actionType === 'generate-report' && (
                            <select
                                aria-label="Report format"
                                className="text-xs bg-background border rounded"
                                value={format}
                                onChange={(e) => setFormat(e.target.value as 'pdf' | 'csv')}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <option value="pdf">PDF</option>
                                <option value="csv">CSV</option>
                            </select>
                        )}
                    </div>
                </>
            )}
        </Button>
    );
};
