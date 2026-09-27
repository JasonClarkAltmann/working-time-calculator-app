import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { toHoursAndMinutes, toMinutes } from '@/utils/workTime'
import { cn } from '@/lib/utils'

type TimeStepperProps = {
    label: string
    value: number | null
    onChange: (value: number) => void
    kind?: 'clock' | 'duration'
}

type StepperFieldProps = {
    label: string
    value: number | null
    max: number
    onChange: (value: number) => void
}

const pad = (value: number) => String(value).padStart(2, '0')

function StepperField({ label, value, max, onChange }: StepperFieldProps) {
    const [draft, setDraft] = useState(value === null ? '' : pad(value))
    const [editing, setEditing] = useState(false)
    const valueRef = useRef(value)
    const delayRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    valueRef.current = value

    useEffect(() => {
        if (!editing) setDraft(value === null ? '' : pad(value))
    }, [value, editing])

    useEffect(() => () => stopRepeat(), [])

    function stopRepeat() {
        if (delayRef.current) clearTimeout(delayRef.current)
        if (intervalRef.current) clearInterval(intervalRef.current)
        delayRef.current = null
        intervalRef.current = null
    }

    function step(direction: 1 | -1) {
        const next = ((valueRef.current ?? 0) + direction + max + 1) % (max + 1)
        valueRef.current = next
        setDraft(pad(next))
        onChange(next)
    }

    function startRepeat(event: ReactPointerEvent<HTMLButtonElement>, direction: 1 | -1) {
        if (event.button !== 0) return
        event.preventDefault()
        stopRepeat()
        step(direction)
        delayRef.current = setTimeout(() => {
            intervalRef.current = setInterval(() => step(direction), 45)
        }, 480)
    }

    function commitDraft() {
        setEditing(false)
        const parsed = Number.parseInt(draft, 10)
        if (!Number.isNaN(parsed)) onChange(Math.min(max, Math.max(0, parsed)))
        else setDraft(value === null ? '' : pad(value))
    }

    const buttonClass =
        'flex h-8 w-full touch-none items-center justify-center text-(--app-muted) transition-colors hover:bg-(--app-accent-soft) hover:text-(--app-accent-bright) active:bg-(--app-accent-soft) focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-(--app-accent)'

    return (
        <div className="w-[4.25rem] overflow-hidden rounded-2xl border border-(--app-border-strong) bg-(--app-control) shadow-sm shadow-black/20 sm:w-[4.75rem]">
            <button
                type="button"
                aria-label={`${label} erhöhen`}
                className={buttonClass}
                onPointerDown={(event) => startRepeat(event, 1)}
                onPointerUp={stopRepeat}
                onPointerCancel={stopRepeat}
                onPointerLeave={stopRepeat}
                onClick={(event) => {
                    if (event.detail === 0) step(1)
                }}
            >
                <ChevronUp className="size-4" strokeWidth={2.5} />
            </button>
            <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                aria-label={label}
                className="h-12 w-full border-y border-(--app-border-strong) bg-transparent text-center text-2xl font-semibold tabular-nums tracking-tight text-(--app-text) placeholder:text-(--app-subtle) outline-none focus:bg-(--app-accent-soft) focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--app-accent) sm:h-14"
                value={draft}
                placeholder="--"
                onFocus={(event) => {
                    setEditing(true)
                    event.currentTarget.select()
                }}
                onChange={(event) => {
                    const text = event.target.value.replace(/\D/g, '').slice(0, 2)
                    setDraft(text)
                    if (text !== '' && Number(text) <= max) onChange(Number(text))
                }}
                onBlur={commitDraft}
                onKeyDown={(event) => {
                    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                        event.preventDefault()
                        step(event.key === 'ArrowUp' ? 1 : -1)
                    }
                    if (event.key === 'Enter') event.currentTarget.blur()
                }}
            />
            <button
                type="button"
                aria-label={`${label} verringern`}
                className={buttonClass}
                onPointerDown={(event) => startRepeat(event, -1)}
                onPointerUp={stopRepeat}
                onPointerCancel={stopRepeat}
                onPointerLeave={stopRepeat}
                onClick={(event) => {
                    if (event.detail === 0) step(-1)
                }}
            >
                <ChevronDown className="size-4" strokeWidth={2.5} />
            </button>
        </div>
    )
}

export function TimeStepper({ label, value, onChange, kind = 'clock' }: TimeStepperProps) {
    const parts = toHoursAndMinutes(value ?? 0)
    const updateHours = (hours: number) => onChange(toMinutes(hours, parts.minutes))
    const updateMinutes = (minutes: number) => onChange(toMinutes(parts.hours, minutes))

    return (
        <div className="flex items-center gap-2 sm:gap-3" role="group" aria-label={label}>
            <StepperField
                label={`${label}: Stunden`}
                value={value === null ? null : parts.hours}
                max={23}
                onChange={updateHours}
            />
            <span
                className={cn(
                    'text-2xl font-semibold leading-none text-(--app-muted)',
                    kind === 'duration' && 'text-lg text-(--app-muted)',
                )}
                aria-hidden="true"
            >
                {kind === 'clock' ? ':' : 'h'}
            </span>
            <StepperField
                label={`${label}: Minuten`}
                value={value === null ? null : parts.minutes}
                max={59}
                onChange={updateMinutes}
            />
            <span className="text-[0.9375rem] font-medium leading-none text-(--app-muted)" aria-hidden="true">
                {kind === 'clock' ? 'Uhr' : 'min'}
            </span>
        </div>
    )
}
