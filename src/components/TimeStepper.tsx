import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { toHoursAndMinutes, toMinutes } from '@/utils/workTime'
import { Button } from '@/components/ui/button'

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

    const stepButton = (direction: 1 | -1) => (
        <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`${label} ${direction === 1 ? 'erhöhen' : 'verringern'}`}
            className="h-8 w-full touch-none rounded-none text-muted-foreground hover:text-primary"
            onPointerDown={(event) => startRepeat(event, direction)}
            onPointerUp={stopRepeat}
            onPointerCancel={stopRepeat}
            onPointerLeave={stopRepeat}
            onClick={(event) => {
                if (event.detail === 0) step(direction)
            }}
        >
            {direction === 1 ? <ChevronUp /> : <ChevronDown />}
        </Button>
    )

    return (
        <div className="w-17 overflow-hidden rounded-xl border sm:w-19 border-input bg-input/30 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:bg-primary/10 focus-within:ring-ring/50">
            {stepButton(1)}
            <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                aria-label={label}
                className="h-12 w-full border-y border-input bg-transparent text-center text-2xl font-semibold sm:h-14 tracking-tight tabular-nums outline-none placeholder:text-muted-foreground/60"
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
            {stepButton(-1)}
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
            <span className="text-2xl font-semibold text-muted-foreground" aria-hidden="true">
                {kind === 'clock' ? ':' : 'h'}
            </span>
            <StepperField
                label={`${label}: Minuten`}
                value={value === null ? null : parts.minutes}
                max={59}
                onChange={updateMinutes}
            />
            <span className="w-8 text-base font-medium text-muted-foreground" aria-hidden="true">
                {kind === 'clock' ? 'Uhr' : 'min'}
            </span>
        </div>
    )
}
