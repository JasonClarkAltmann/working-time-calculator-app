import { Monitor, Moon, Palette, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { accents, useAppearance } from '@/hooks/useAppearance'
import type { Accent, Theme } from '@/hooks/useAppearance'

const themes = [
    { value: 'light', label: 'Hell', icon: Sun },
    { value: 'dark', label: 'Dunkel', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
] as const

export function AppearanceMenu() {
    const { theme, setTheme, accent, setAccent } = useAppearance()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon-lg" aria-label="Darstellung anpassen">
                    <Palette />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Farbschema</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                    value={theme}
                    onValueChange={(value) => setTheme(value as Theme)}
                >
                    {themes.map(({ value, label, icon: Icon }) => (
                        <DropdownMenuRadioItem key={value} value={value}>
                            <Icon />
                            {label}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Akzentfarbe</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                    value={accent}
                    onValueChange={(value) => setAccent(value as Accent)}
                >
                    {accents.map(({ value, label }) => (
                        <DropdownMenuRadioItem key={value} value={value}>
                            <span
                                data-accent={value}
                                className="size-3.5 rounded-full bg-primary ring-1 ring-foreground/15"
                            />
                            {label}
                        </DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
