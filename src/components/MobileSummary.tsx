import { SignedDuration } from '@/components/SignedDuration'
import { formatDuration } from '@/utils/workTime'

export function MobileSummary({
    workMinutes,
    overtime,
}: {
    workMinutes: number
    overtime: number
}) {
    return (
        <aside
            aria-label="Aktuelles Ergebnis"
            className="fixed inset-x-0 bottom-0 z-20 border-t bg-background/80 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-lg lg:hidden"
        >
            <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x text-sm">
                <div className="pr-4">
                    <div className="text-muted-foreground">Arbeitszeit</div>
                    <div className="mt-1 text-lg font-semibold tracking-tight tabular-nums">
                        {formatDuration(workMinutes)}
                    </div>
                </div>
                <div className="pl-4">
                    <div className="text-muted-foreground">Gleitzeit</div>
                    <SignedDuration
                        minutes={overtime}
                        className="mt-1 text-lg font-semibold tracking-tight tabular-nums"
                    />
                </div>
            </div>
        </aside>
    )
}
