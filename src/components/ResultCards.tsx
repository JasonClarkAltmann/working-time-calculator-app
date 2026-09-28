import type { ReactNode } from 'react'
import { Clock3, House, Minus, TrendingDown, TrendingUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardAction, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { SignedDuration } from '@/components/SignedDuration'
import type { WorkDay } from '@/hooks/useWorkDay'
import { cn } from '@/lib/utils'
import { formatDuration, formatTime } from '@/utils/workTime'

function ResultCard({
    icon: Icon,
    iconClassName,
    title,
    action,
    value,
    hint,
    error = false,
}: {
    icon?: LucideIcon
    iconClassName?: string
    title: string
    action?: ReactNode
    value: ReactNode
    hint: string
    error?: boolean
}) {
    return (
        <Card className="min-h-45 flex-1 justify-center [--card-spacing:--spacing(6)] sm:[--card-spacing:--spacing(8)] lg:min-h-62">
            <CardHeader>
                <CardDescription className="flex items-center gap-2 text-base font-medium">
                    {Icon && <Icon className={cn('size-4', iconClassName)} />}
                    {title}
                </CardDescription>
                {action && <CardAction>{action}</CardAction>}
            </CardHeader>
            <CardContent aria-live="polite">
                <div className="text-6xl font-semibold tracking-tighter tabular-nums lg:text-7xl">
                    {value ?? <span className="text-muted-foreground/40">—</span>}
                </div>
                <p
                    role={error ? 'alert' : undefined}
                    className={cn(
                        'mt-4 text-base text-muted-foreground',
                        error && 'text-destructive',
                    )}
                >
                    {hint}
                </p>
            </CardContent>
        </Card>
    )
}

export function ResultCards({ day }: { day: WorkDay }) {
    const { mode, message, error, overtime, nextDay } = day
    const result = message
        ? null
        : mode === 'end'
          ? formatDuration(day.workMinutes!)
          : `${formatTime(day.calculatedEnd!)} Uhr`

    const overtimeTitle =
        overtime === null
            ? 'Über- oder Minusstunden'
            : overtime > 0
              ? 'Überstunden'
              : overtime < 0
                ? 'Minusstunden'
                : 'Ausgeglichen'
    const OvertimeIcon =
        overtime === null
            ? undefined
            : overtime > 0
              ? TrendingUp
              : overtime < 0
                ? TrendingDown
                : Minus

    return (
        <div className="flex flex-col gap-5 lg:gap-6">
            <ResultCard
                icon={mode === 'end' ? Clock3 : House}
                title={mode === 'end' ? 'Deine Arbeitszeit' : 'Dein Feierabend'}
                action={nextDay && !message && <Badge variant="secondary">Folgetag</Badge>}
                value={result}
                hint={message ?? (mode === 'end' ? 'Pause bereits abgezogen' : 'inklusive Pause')}
                error={error}
            />
            <ResultCard
                icon={OvertimeIcon}
                iconClassName={cn(
                    overtime !== null && overtime > 0 && 'text-success',
                    overtime !== null && overtime < 0 && 'text-destructive',
                )}
                title={overtimeTitle}
                value={overtime === null ? null : <SignedDuration minutes={overtime} />}
                hint="Gegenüber 8 Stunden Nettoarbeitszeit"
            />
        </div>
    )
}
