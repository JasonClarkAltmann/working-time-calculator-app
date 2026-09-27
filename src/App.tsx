import { useState } from 'react'
import {
    ArrowRight,
    Clock3,
    Coffee,
    House,
    Minus,
    RotateCcw,
    Timer,
    TrendingDown,
    TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TimeStepper } from '@/components/TimeStepper'
import {
    MINUTES_PER_DAY,
    calculateEndMinutes,
    calculateOvertimeMinutes,
    calculateWorkMinutes,
    formatTime,
    toHoursAndMinutes,
    toMinutes,
} from '@/utils/workTime'

type Mode = 'end' | 'duration'

const breaks = [0, 30, 45, 60] as const
const formatDuration = (minutes: number) => {
    const { hours, minutes: rest } = toHoursAndMinutes(minutes)
    return `${String(hours).padStart(2, '0')}h ${String(rest).padStart(2, '0')}m`
}

export default function App() {
    const [mode, setMode] = useState<Mode>('end')
    const [startTime, setStartTime] = useState(toMinutes(8, 0))
    const [endTime, setEndTime] = useState<number | null>(null)
    const [workDuration, setWorkDuration] = useState<number | null>(null)
    const [breakDuration, setBreakDuration] = useState(30)

    const attendance =
        endTime === null || endTime === startTime
            ? null
            : (endTime - startTime + MINUTES_PER_DAY) % MINUTES_PER_DAY
    const calculatedWork =
        attendance === null || attendance < breakDuration
            ? null
            : calculateWorkMinutes(startTime, endTime!, breakDuration)
    const validDuration =
        workDuration !== null && workDuration > 0 && workDuration + breakDuration < MINUTES_PER_DAY
    const calculatedEnd = validDuration
        ? calculateEndMinutes(startTime, workDuration, breakDuration)
        : null
    const activeWork = mode === 'end' ? calculatedWork : validDuration ? workDuration : null
    const overtime = activeWork === null ? null : calculateOvertimeMinutes(activeWork)
    const nextDay =
        mode === 'end'
            ? endTime !== null && endTime < startTime
            : calculatedEnd !== null && calculatedEnd >= MINUTES_PER_DAY

    let message: string | null = null
    let error = false
    if (mode === 'end') {
        if (endTime === null) message = 'Feierabend eingeben'
        else if (endTime === startTime) {
            message = 'Arbeitsbeginn und Feierabend dürfen nicht gleich sein.'
            error = true
        } else if (attendance !== null && attendance < breakDuration) {
            message = 'Die Pause ist länger als die Anwesenheit.'
            error = true
        }
    } else if (workDuration === null || workDuration === 0) {
        message = 'Arbeitsdauer eingeben'
    } else if (!validDuration) {
        message = 'Die Schicht muss kürzer als 24 Stunden sein.'
        error = true
    }

    function reset() {
        setStartTime(toMinutes(8, 0))
        setEndTime(null)
        setWorkDuration(null)
        setBreakDuration(30)
    }

    function setNow() {
        const now = new Date()
        setEndTime(toMinutes(now.getHours(), now.getMinutes()))
    }

    return (
        <main
            className={`min-h-svh bg-(--app-canvas) px-4 pt-5 text-(--app-text) sm:px-6 sm:pt-8 lg:px-10 ${activeWork === null ? 'pb-10' : 'pb-32 lg:pb-10'}`}
        >
            <div className="mx-auto max-w-6xl">
                <header className="mb-6 border-b border-(--app-border) pb-5 sm:mb-8 sm:pb-6">
                    <div className="flex items-center gap-3">
                        <div className="flex size-9 items-center justify-center rounded-lg border border-(--app-border-strong) bg-(--app-control) text-(--app-text)">
                            <Clock3 className="size-[18px]" strokeWidth={2} />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
                                Jasons Arbeitszeitrechner
                            </h1>
                            <p className="text-sm text-(--app-muted)">
                                Arbeitszeit und Gleitzeit auf einen Blick
                            </p>
                        </div>
                    </div>
                </header>

                <div className="grid items-stretch gap-5 lg:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.88fr)] lg:gap-6">
                    <Card className="gap-0 overflow-hidden rounded-2xl border border-(--app-border) bg-(--app-panel) py-0 ring-0 shadow-none">
                        <CardContent className="p-5 sm:p-8 lg:flex lg:flex-1 lg:flex-col">
                            <div className="mb-7 flex items-start justify-between gap-4 lg:mb-0">
                                <div>
                                    <h2 className="text-xl font-semibold tracking-tight text-(--app-text)">
                                        Arbeitstag
                                    </h2>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={reset}
                                    className="h-9 rounded-xl px-3 text-sm! text-(--app-muted) hover:bg-white/10 hover:text-white"
                                >
                                    <RotateCcw className="size-4" />{' '}
                                    <span className="hidden sm:inline">Zurücksetzen</span>
                                    <span className="sr-only sm:hidden">Zurücksetzen</span>
                                </Button>
                            </div>

                            <div className="space-y-7 lg:flex lg:flex-1 lg:flex-col lg:space-y-0">
                                <section className="flex flex-col justify-between gap-4 border-b border-(--app-border) pb-7 sm:flex-row sm:items-center lg:py-7">
                                    <div>
                                        <div className="mb-1 flex items-center gap-2 text-[1.0625rem] font-semibold text-(--app-text)">
                                            <Clock3 className="size-4 text-(--app-accent)" />{' '}
                                            Arbeitsbeginn
                                        </div>
                                        <p className="text-[0.9375rem] text-(--app-muted)">
                                            Wann startest du?
                                        </p>
                                    </div>
                                    <TimeStepper
                                        label="Arbeitsbeginn"
                                        value={startTime}
                                        onChange={setStartTime}
                                    />
                                </section>

                                <section className="border-b border-(--app-border) pb-7 lg:py-7">
                                    <div className="mb-4 flex items-center gap-2 text-[1.0625rem] font-semibold text-(--app-text)">
                                        <Coffee className="size-4 text-(--app-accent)" /> Pause
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                        {breaks.map((minutes) => (
                                            <button
                                                key={minutes}
                                                type="button"
                                                onClick={() => setBreakDuration(minutes)}
                                                aria-pressed={breakDuration === minutes}
                                                className={`h-11 rounded-xl border text-[0.9375rem] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--app-accent) ${breakDuration === minutes ? 'border-(--app-accent) bg-(--app-accent-soft) text-(--app-accent-bright)' : 'border-(--app-border-strong) bg-(--app-control) text-(--app-muted) hover:border-(--app-accent) hover:bg-(--app-accent-soft)'}`}
                                            >
                                                {minutes === 0
                                                    ? 'Keine'
                                                    : minutes === 60
                                                      ? '1 h'
                                                      : `${minutes} min`}
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                <section className="flex flex-col justify-center gap-3 lg:py-7">
                                    <div className="flex flex-wrap items-center justify-between gap-3">
                                        <div className="flex items-center gap-2">
                                            <h3 className="flex items-center gap-2 text-[1.0625rem] font-semibold text-(--app-text)">
                                                <Clock3 className="size-4 text-(--app-accent)" />
                                                Zeitangabe
                                            </h3>
                                            {mode === 'end' &&
                                                endTime !== null &&
                                                endTime < startTime && (
                                                    <span className="rounded-full border border-(--app-accent-border) bg-(--app-accent-soft) px-2.5 py-0.5 text-sm font-semibold text-(--app-accent-bright)">
                                                        Folgetag
                                                    </span>
                                                )}
                                        </div>
                                        <div
                                            role="group"
                                            aria-label="Zeitangabe auswählen"
                                            className="grid w-fit grid-cols-2 gap-1 rounded-xl border border-(--app-border) bg-(--app-canvas) p-1"
                                        >
                                            <button
                                                type="button"
                                                aria-pressed={mode === 'end'}
                                                onClick={() => setMode('end')}
                                                className={`flex h-9 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--app-accent) ${mode === 'end' ? 'bg-(--app-control) text-(--app-text)' : 'text-(--app-muted) hover:bg-(--app-control) hover:text-(--app-text)'}`}
                                            >
                                                <House className="size-3.5" /> Feierabend
                                            </button>
                                            <button
                                                type="button"
                                                aria-pressed={mode === 'duration'}
                                                onClick={() => setMode('duration')}
                                                className={`flex h-9 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--app-accent) ${mode === 'duration' ? 'bg-(--app-control) text-(--app-text)' : 'text-(--app-muted) hover:bg-(--app-control) hover:text-(--app-text)'}`}
                                            >
                                                <Timer className="size-3.5" /> Arbeitsdauer
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                        <div>
                                            <p className="text-[0.9375rem] text-(--app-muted)">
                                                {mode === 'end'
                                                    ? 'Wann hörst du auf?'
                                                    : 'Wie lange möchtest du arbeiten?'}
                                            </p>
                                            {mode === 'end' && (
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    onClick={setNow}
                                                    className="mt-4 h-11 rounded-xl border-transparent bg-(--app-accent) px-4 text-[0.9375rem] font-bold text-(--primary-foreground) shadow-[0_10px_24px_-12px_rgba(255,255,255,0.2)] hover:bg-(--app-accent-bright)"
                                                >
                                                    Jetzt übernehmen{' '}
                                                    <ArrowRight className="size-4" />
                                                </Button>
                                            )}
                                        </div>
                                        {mode === 'end' ? (
                                            <TimeStepper
                                                label="Feierabend"
                                                value={endTime}
                                                onChange={setEndTime}
                                            />
                                        ) : (
                                            <TimeStepper
                                                label="Arbeitsdauer"
                                                value={workDuration}
                                                onChange={setWorkDuration}
                                                kind="duration"
                                            />
                                        )}
                                    </div>
                                </section>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-5 lg:h-full lg:gap-6">
                        <section className="flex min-h-[180px] flex-1 flex-col justify-center rounded-2xl border border-(--app-border) bg-(--app-panel) p-6 sm:p-8 lg:min-h-[250px]">
                            <div aria-live="polite">
                                <h2 className="mb-4 flex items-center gap-2 text-[0.9375rem] font-medium text-(--app-muted)">
                                    {mode === 'end' ? (
                                        <Clock3 className="size-4" />
                                    ) : (
                                        <House className="size-4" />
                                    )}
                                    {mode === 'end' ? 'Deine Arbeitszeit' : 'Dein Feierabend'}
                                </h2>
                                {message ? (
                                    <div>
                                        <div className="text-[clamp(3.5rem,5vw,4.7rem)] font-semibold leading-none tracking-[-0.06em] text-white/35">
                                            —
                                        </div>
                                        <p
                                            className={`mt-4 max-w-xs text-[1.0625rem] leading-relaxed ${error ? 'text-(--app-negative)' : 'text-(--app-muted)'}`}
                                            role={error ? 'alert' : undefined}
                                        >
                                            {message}
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-[clamp(3.2rem,5vw,4.7rem)] font-semibold leading-none tracking-[-0.065em] text-white tabular-nums">
                                            {mode === 'end'
                                                ? formatDuration(calculatedWork!)
                                                : formatTime(calculatedEnd!)}
                                        </div>
                                        <p className="mt-4 text-[0.9375rem] text-(--app-muted)">
                                            {mode === 'duration' ? (
                                                <>
                                                    Uhr{' '}
                                                    {nextDay && (
                                                        <span className="ml-2 rounded-full bg-(--app-accent-soft) px-2.5 py-1 font-semibold text-(--app-accent-bright)">
                                                            Folgetag
                                                        </span>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    Pause bereits abgezogen{' '}
                                                    {nextDay && '· Feierabend am Folgetag'}
                                                </>
                                            )}
                                        </p>
                                    </>
                                )}
                            </div>
                        </section>

                        <section
                            className="flex min-h-[180px] flex-1 flex-col justify-center rounded-2xl border border-(--app-border) bg-(--app-panel) p-6 sm:p-8 lg:min-h-[250px]"
                            aria-live="polite"
                        >
                            <div>
                                <h2 className="mb-4 flex items-center gap-2 text-[0.9375rem] font-medium text-(--app-muted)">
                                    {overtime === null ? null : overtime > 0 ? (
                                        <TrendingUp className="size-4 text-(--app-positive)" />
                                    ) : overtime < 0 ? (
                                        <TrendingDown className="size-4 text-(--app-negative)" />
                                    ) : (
                                        <Minus className="size-4" />
                                    )}
                                    {overtime === null
                                        ? 'Über- oder Minusstunden'
                                        : overtime > 0
                                          ? 'Überstunden'
                                          : overtime < 0
                                            ? 'Minusstunden'
                                            : 'Ausgeglichen'}
                                </h2>
                                {overtime === null ? (
                                    <div className="text-[clamp(3.2rem,5vw,4.7rem)] font-semibold leading-none text-white/35">
                                        —
                                    </div>
                                ) : (
                                    <div
                                        className={`text-[clamp(3.2rem,5vw,4.7rem)] font-semibold leading-none tracking-[-0.065em] tabular-nums ${overtime > 0 ? 'text-(--app-positive)' : overtime < 0 ? 'text-(--app-negative)' : 'text-white'}`}
                                    >
                                        {overtime > 0 ? '+' : overtime < 0 ? '−' : ''}
                                        {formatDuration(Math.abs(overtime))}
                                    </div>
                                )}
                                <p className="mt-4 text-[0.9375rem] text-(--app-muted)">
                                    Gegenüber 8 Stunden Nettoarbeitszeit
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
            {activeWork !== null && overtime !== null && (
                <aside
                    aria-label="Aktuelles Ergebnis"
                    className="fixed inset-x-0 bottom-0 z-20 border-t border-(--app-border) bg-(--app-panel) px-4 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-[0_-12px_32px_rgba(0,0,0,0.35)] sm:px-6 lg:hidden"
                >
                    <div className="mx-auto grid max-w-6xl grid-cols-2">
                        <div className="pr-4">
                            <div className="text-sm text-(--app-muted)">Arbeitszeit</div>
                            <div className="mt-1 text-lg font-semibold tracking-tight tabular-nums">
                                {formatDuration(activeWork)}
                            </div>
                        </div>
                        <div className="border-l border-(--app-border) pl-4">
                            <div className="text-sm text-(--app-muted)">Gleitzeit</div>
                            <div
                                className={`mt-1 text-lg font-semibold tracking-tight tabular-nums ${overtime > 0 ? 'text-(--app-positive)' : overtime < 0 ? 'text-(--app-negative)' : 'text-(--app-text)'}`}
                            >
                                {overtime > 0 ? '+' : overtime < 0 ? '−' : ''}
                                {formatDuration(Math.abs(overtime))}
                            </div>
                        </div>
                    </div>
                </aside>
            )}
        </main>
    )
}
