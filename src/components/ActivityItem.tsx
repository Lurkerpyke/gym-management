// components/ActivityItem.tsx
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ActivityLog } from '@prisma/client';

export const ActivityItem = ({
    activity
}: {
    activity: ActivityLog & {
        user: {
            name: string | null;
            image: string | null
        }
    }
}) => {
    const getActivityDetails = (type: string) => {
        switch (type) {
            case 'USER_LOGIN':
                return { icon: '🟢', text: 'Login realizado' };
            case 'PROFILE_UPDATE':
                return { icon: '🔵', text: 'Perfil atualizado' };
            case 'WORKOUT_CREATED':
                return { icon: '🏋️', text: 'Treino registrado' };
            case 'ROLE_CHANGE':
                return { icon: '🛡️', text: 'Permissão alterada' };
            default:
                return { icon: '⚪', text: 'Atividade do sistema' };
        }
    };

    const details = getActivityDetails(activity.actionType);

    return (
        <div className="flex items-center justify-between p-2 hover:bg-muted/50">
            <div className="flex items-center gap-3">
                <span className="text-sm">{details.icon}</span>
                <div>
                    <p className="text-sm">
                        {details.text}{' '}
                        {activity.description && (
                            <span className="text-muted-foreground">- {activity.description}</span>
                        )}
                    </p>
                    {activity.user && (
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                                Por {activity.user.name}
                            </span>
                        </div>
                    )}
                </div>
            </div>
            <span className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(activity.createdAt), {
                    addSuffix: true,
                    locale: ptBR
                })}
            </span>
        </div>
    );
};