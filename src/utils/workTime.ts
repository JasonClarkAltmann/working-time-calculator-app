export const MINUTES_PER_DAY = 24 * 60
export const REGULAR_WORK_MINUTES = 8 * 60

export const toMinutes = (hours: number, minutes: number): number => hours * 60 + minutes

export const toHoursAndMinutes = (totalMinutes: number) => ({
    hours: Math.floor(totalMinutes / 60),
    minutes: totalMinutes % 60,
})

export const formatTime = (totalMinutes: number): string => {
    const { hours, minutes } = toHoursAndMinutes(
        ((totalMinutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY,
    )
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}

export const calculateWorkMinutes = (
    startMinutes: number,
    endMinutes: number,
    breakMinutes: number,
) => {
    const duration = (endMinutes - startMinutes + MINUTES_PER_DAY) % MINUTES_PER_DAY
    return duration - breakMinutes
}

export const calculateEndMinutes = (
    startMinutes: number,
    workMinutes: number,
    breakMinutes: number,
) => startMinutes + workMinutes + breakMinutes

export const calculateOvertimeMinutes = (workMinutes: number) => workMinutes - REGULAR_WORK_MINUTES
