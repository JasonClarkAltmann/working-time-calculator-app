import { useState } from 'react'
import {
    MINUTES_PER_DAY,
    calculateEndMinutes,
    calculateOvertimeMinutes,
    calculateWorkMinutes,
    toMinutes,
} from '@/utils/workTime'

export type Mode = 'end' | 'duration'

const DEFAULT_START = toMinutes(8, 0)
const DEFAULT_BREAK = 30

export function useWorkDay() {
    const [mode, setMode] = useState<Mode>('end')
    const [startTime, setStartTime] = useState(DEFAULT_START)
    const [endTime, setEndTime] = useState<number | null>(null)
    const [workDuration, setWorkDuration] = useState<number | null>(null)
    const [breakDuration, setBreakDuration] = useState(DEFAULT_BREAK)

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
        setWorkDuration(null)
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
