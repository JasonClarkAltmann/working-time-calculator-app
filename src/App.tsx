import { Clock3 } from 'lucide-react'
import { AppearanceMenu } from '@/components/AppearanceMenu'
import { MobileSummary } from '@/components/MobileSummary'
import { ResultCards } from '@/components/ResultCards'
import { WorkDayCard } from '@/components/WorkDayCard'
import { useWorkDay } from '@/hooks/useWorkDay'
import { cn } from '@/lib/utils'

export default function App() {
    const day = useWorkDay()
    const hasResult = day.workMinutes !== null && day.overtime !== null

    return (
        <main
            className={cn(
                'min-h-svh px-4 pt-5 pb-10 sm:px-6 sm:pt-8 lg:px-10',
                hasResult && 'pb-32 lg:pb-10',
            )}
        >
            <div className="mx-auto max-w-6xl">
                <header className="mb-6 flex items-center gap-3 border-b pb-5 sm:mb-8 sm:pb-6">
                    <div className="flex size-9 items-center justify-center rounded-lg border bg-secondary">
                        <Clock3 className="size-4.5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
                            Jasons Arbeitszeitrechner
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Arbeitszeit und Gleitzeit auf einen Blick
                        </p>
                    </div>
                    <div className="ml-auto">
                        <AppearanceMenu />
                    </div>
                </header>

                <div className="grid gap-5 lg:grid-cols-[minmax(0,1.12fr)_minmax(20rem,0.88fr)] lg:gap-6">
                    <WorkDayCard day={day} />
                    <ResultCards day={day} />
                </div>
            </div>

            {hasResult && <MobileSummary workMinutes={day.workMinutes!} overtime={day.overtime!} />}
        </main>
    )
}
