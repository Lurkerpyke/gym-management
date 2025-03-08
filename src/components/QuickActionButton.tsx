// components/QuickActionButton.tsx
'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Users, Bell, Activity, AlertCircle } from "lucide-react";

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

    const handleAction = () => {
        switch (actionType) {
            case 'add-user':
                router.push('/owner/users/create');
                break;
            case 'send-notification':
                router.push('/owner/notifications/new');
                break;
            case 'generate-report':
                toast.info('Funcionalidade de relatório em desenvolvimento');
                break;
            case 'system-settings':
                toast.info('Configurações do sistema em desenvolvimento');
                break;
        }
    };

    return (
        <Button
            variant="outline"
            className="h-24 flex flex-col items-center justify-center"
            onClick={handleAction}
        >
            <IconComponent className="h-6 w-6 mb-2" />
            <span className="text-sm">{label}</span>
        </Button>
    );
};