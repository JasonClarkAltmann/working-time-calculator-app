# Jasons Arbeitszeitrechner

Eine responsive Web-App im Dark Mode zum Berechnen von Arbeitszeit und Feierabend. Zeiten und Pause lassen sich direkt ändern; das Ergebnis und die Über- oder Minusstunden aktualisieren sich sofort. Die Zeitfelder haben Pfeile zum Klicken und Gedrückthalten. Stunden laufen zwischen 0 und 23 um, Minuten zwischen 0 und 59.

## Bedienung

1. Arbeitsbeginn einstellen.
2. Unter **Feierabend** die Endzeit eingeben oder mit **Jetzt übernehmen** die aktuelle Uhrzeit setzen. Die Nettoarbeitszeit erscheint im Ergebnisbereich.
3. Unter **Arbeitsdauer** stattdessen die gewünschte Nettoarbeitszeit eingeben. Der Ergebnisbereich zeigt die Feierabendzeit.
4. Eine Pause von 0, 30, 45 oder 60 Minuten wählen.

Eine Endzeit vor dem Arbeitsbeginn gilt als Folgetag. Berechneter Feierabend am Folgetag wird ebenfalls gekennzeichnet. Start und Ende zur gleichen Uhrzeit sowie Schichten ab 24 Stunden sind ungültig. Eine Pause darf höchstens so lang sein wie die Anwesenheit. Über- und Minusstunden werden gegenüber einem Achtstundentag berechnet.

## Lokal starten

Voraussetzung: Node.js 20.19+ oder 22.12+ und npm.

```sh
npm install
npm run dev
```

`npm run build` führt die TypeScript-Prüfung und den Produktionsbuild aus. Die App verwendet React, TypeScript, Vite, Tailwind CSS, shadcn/ui und Lucide.
