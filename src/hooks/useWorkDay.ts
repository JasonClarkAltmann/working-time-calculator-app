import { useEffect, useState } from 'react'
import {
    MINUTES_PER_DAY,
    REGULAR_WORK_MINUTES,
    calculateEndMinutes,
    calculateOvertimeMinutes,
    calculateWorkMinutes,
    toMinutes,
} from '@/utils/workTime'

export type Mode = 'end' | 'duration'

const DEFAULT_START = toMinutes(8, 0)
const DEFAULT_BREAK = 30

const DAY_KEY = 'workDay'
const MODE_KEY = 'mode'
const BREAK_KEY = 'breakDuration'

type StoredDay = {
    date: string
    startTime: number
    endTime: number | null
    workDuration: number | null
}

const today = () => new Date().toLocaleDateString('sv')

// Only restores the day when it was saved today, so yesterday's times never carry over.
function readStoredDay(): Omit<StoredDay, 'date'> {
    try {
        const stored = JSON.parse(localStorage.getItem(DAY_KEY) ?? 'null') as StoredDay | null
        if (stored?.date === today()) return stored
    } catch {
        // ignore malformed entries
    }
    return { startTime: DEFAULT_START, endTime: null, workDuration: REGULAR_WORK_MINUTES }
}

function readStoredBreak(): number {
    const value = Number(localStorage.getItem(BREAK_KEY) ?? DEFAULT_BREAK)
    return Number.isInteger(value) && value >= 0 ? value : DEFAULT_BREAK
}

export function useWorkDay() {
    const [initialDay] = useState(readStoredDay)
    const [mode, setMode] = useState<Mode>(() =>
        localStorage.getItem(MODE_KEY) === 'duration' ? 'duration' : 'end',
    )
    const [startTime, setStartTime] = useState(initialDay.startTime)
    const [endTime, setEndTime] = useState(initialDay.endTime)
    const [workDuration, setWorkDuration] = useState(initialDay.workDuration)
    const [breakDuration, setBreakDuration] = useState(readStoredBreak)

    useEffect(() => {
        const day: StoredDay = { date: today(), startTime, endTime, workDuration }
        localStorage.setItem(DAY_KEY, JSON.stringify(day))
    }, [startTime, endTime, workDuration])

    useEffect(() => {
        localStorage.setItem(MODE_KEY, mode)
    }, [mode])

    useEffect(() => {
        localStorage.setItem(BREAK_KEY, String(breakDuration))
    }, [breakDuration])

    const attendance =
        endTime === null || endTime === startTime
            ? null
            : (endTime - startTime + MINUTES_PER_DAY) % MINUTES_PER_DAY
    const calculatedWork =
        endTime === null || attendance === null || attendance < breakDuration
            ? null
            : calculateWorkMinutes(startTime, endTime, breakDuration)
    const validDuration =
        workDuration !== null && workDuration > 0 && workDuration + breakDuration < MINUTES_PER_DAY
    const calculatedEnd = validDuration
        ? calculateEndMinutes(startTime, workDuration, breakDuration)
        : null
    const workMinutes = mode === 'end' ? calculatedWork : validDuration ? workDuration : null
    const overtime = workMinutes === null ? null : calculateOvertimeMinutes(workMinutes)
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
        setStartTime(DEFAULT_START)
        setEndTime(null)
        setWorkDuration(REGULAR_WORK_MINUTES)
        setBreakDuration(DEFAULT_BREAK)
    }

    function setEndToNow() {
        const now = new Date()
        setEndTime(toMinutes(now.getHours(), now.getMinutes()))
    }

    return {
        mode,
        setMode,
        startTime,
        setStartTime,
        endTime,
        setEndTime,
        workDuration,
        setWorkDuration,
        breakDuration,
        setBreakDuration,
        calculatedEnd,
        workMinutes,
        overtime,
        nextDay,
        message,
        error,
        reset,
        setEndToNow,
    }
}

export type WorkDay = ReturnType<typeof useWorkDay>
