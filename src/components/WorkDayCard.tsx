import type { ReactNode } from 'react'
import { ArrowRight, Clock3, Coffee, House, RotateCcw, Timer } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { TimeStepper } from '@/components/TimeStepper'
import type { Mode, WorkDay } from '@/hooks/useWorkDay'
import { cn } from '@/lib/utils'

const breaks = [
    { minutes: 0, label: 'Keine' },
    { minutes: 30, label: '30 min' },
    { minutes: 45, label: '45 min' },
    { minutes: 60, label: '1 h' },
]

const activeTab = cn(
    'px-3 group-data-[variant=default]/tabs-list:data-[state=active]:shadow-none',
    'data-[state=active]:border-primary/40 data-[state=active]:bg-primary/15 data-[state=active]:text-primary',
    'dark:data-[state=active]:border-primary/40 dark:data-[state=active]:bg-primary/15 dark:data-[state=active]:text-primary',
)

function SectionTitle({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
    return (
        <h3 className="flex items-center gap-2 text-base font-semibold">
            <Icon className="size-4 text-primary" />
            {children}
        </h3>
    )
}

function Section({ className, children }: { className?: string; children: ReactNode }) {
    return <section className={cn('py-7 first:pt-0 last:pb-0', className)}>{children}</section>
}

export function WorkDayCard({ day }: { day: WorkDay }) {
    return (
        <Card className="[--card-spacing:--spacing(6)] sm:[--card-spacing:--spacing(8)]">
            <CardHeader>
                <CardTitle className="text-xl font-semibold tracking-tight">Arbeitstag</CardTitle>
                <CardAction>
                    <Button variant="ghost" onClick={day.reset}>
                        <RotateCcw data-icon="inline-start" />
                        Zurücksetzen
                    </Button>
                </CardAction>
            </CardHeader>
            <CardContent className="divide-y">
                <Section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="space-y-1">
                        <SectionTitle icon={Clock3}>Arbeitsbeginn</SectionTitle>
                        <p className="text-base text-muted-foreground">Wann startest du?</p>
                    </div>
                    <TimeStepper
                        label="Arbeitsbeginn"
                        value={day.startTime}
                        onChange={day.setStartTime}
                    />
                </Section>

                <Section className="space-y-4">
                    <SectionTitle icon={Coffee}>Pause</SectionTitle>
                    <ToggleGroup
                        type="single"
                        variant="outline"
                        size="lg"
                        aria-label="Pause"
                        className="grid w-full grid-cols-4"
                        value={String(day.breakDuration)}
                        onValueChange={(value) => value && day.setBreakDuration(Number(value))}
                    >
                        {breaks.map(({ minutes, label }) => (
                            <ToggleGroupItem
                                key={minutes}
                                value={String(minutes)}
                                className="h-11 text-base data-[state=on]:border-primary/40 data-[state=on]:bg-primary/15 data-[state=on]:text-primary"
                            >
                                {label}
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                </Section>

                <Section>
                    <Tabs
                        value={day.mode}
                        onValueChange={(value) => day.setMode(value as Mode)}
                        className="gap-4"
                    >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <SectionTitle icon={Clock3}>Zeitangabe</SectionTitle>
                                {day.mode === 'end' && day.nextDay && (
                                    <Badge variant="secondary">Folgetag</Badge>
                                )}
                            </div>
                            <TabsList
                                aria-label="Zeitangabe auswählen"
                                className="group-data-horizontal/tabs:h-10"
                            >
                                <TabsTrigger value="end" className={activeTab}>
                                    <House data-icon="inline-start" />
                                    Feierabend
                                </TabsTrigger>
                                <TabsTrigger value="duration" className={activeTab}>
                                    <Timer data-icon="inline-start" />
                                    Arbeitsdauer
                                </TabsTrigger>
                            </TabsList>
                        </div>
                        <TabsContent
                            value="end"
                            className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
                        >
                            <div className="space-y-4">
                                <p className="text-base text-muted-foreground">
                                    Wann hörst du auf?
                                </p>
                                <Button
                                    size="lg"
                                    className="h-11 px-4 text-base"
                                    onClick={day.setEndToNow}
                                >
                                    Jetzt übernehmen
                                    <ArrowRight data-icon="inline-end" />
                                </Button>
                            </div>
                            <TimeStepper
                                label="Feierabend"
                                value={day.endTime}
                                onChange={day.setEndTime}
                            />
                        </TabsContent>
                        <TabsContent
                            value="duration"
                            className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
                        >
                            <p className="text-base text-muted-foreground">
                                Wie lange möchtest du arbeiten?
                            </p>
                            <TimeStepper
                                label="Arbeitsdauer"
                                kind="duration"
                                value={day.workDuration}
                                onChange={day.setWorkDuration}
                            />
                        </TabsContent>
                    </Tabs>
                </Section>
            </CardContent>
        </Card>
    )
}
