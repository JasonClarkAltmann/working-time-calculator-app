import { cn } from '@/lib/utils'
import { formatSignedDuration } from '@/utils/workTime'

export function SignedDuration({ minutes, className }: { minutes: number; className?: string }) {
    return (
        <span
            className={cn(
                minutes > 0 && 'text-success',
                minutes < 0 && 'text-destructive',
                className,
            )}
        >
            {formatSignedDuration(minutes)}
        </span>
    )
}
