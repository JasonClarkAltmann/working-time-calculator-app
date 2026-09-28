import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark' | 'system'
export type Accent = 'neutral' | 'blue' | 'violet' | 'green' | 'orange' | 'rose'

export const accents: { value: Accent; label: string }[] = [
    { value: 'neutral', label: 'Neutral' },
    { value: 'blue', label: 'Blau' },
    { value: 'violet', label: 'Violett' },
    { value: 'green', label: 'Grün' },
    { value: 'orange', label: 'Orange' },
    { value: 'rose', label: 'Rosa' },
]

const THEME_KEY = 'theme'
const ACCENT_KEY = 'accent'
const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')

function readStored<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
    const value = localStorage.getItem(key)
    return allowed.includes(value as T) ? (value as T) : fallback
}

export function useAppearance() {
    const [theme, setTheme] = useState<Theme>(() =>
        readStored(THEME_KEY, ['light', 'dark', 'system'], 'system'),
    )
    const [accent, setAccent] = useState<Accent>(() =>
        readStored(
            ACCENT_KEY,
            accents.map((a) => a.value),
            'neutral',
        ),
    )

    useEffect(() => {
        const root = document.documentElement
        const apply = () => {
            const dark = theme === 'dark' || (theme === 'system' && darkQuery.matches)
            root.classList.toggle('dark', dark)
            root.style.colorScheme = dark ? 'dark' : 'light'
        }
        apply()
        localStorage.setItem(THEME_KEY, theme)
        if (theme !== 'system') return
        darkQuery.addEventListener('change', apply)
        return () => darkQuery.removeEventListener('change', apply)
    }, [theme])

    useEffect(() => {
        document.documentElement.dataset.accent = accent
        localStorage.setItem(ACCENT_KEY, accent)
    }, [accent])

    return { theme, setTheme, accent, setAccent }
}
