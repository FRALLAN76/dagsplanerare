# Dagsplanerare för Barn - Agent Documentation

## Projektöversikt

En visuell dagsplanerare för barn med symbolstöd, byggd som en standalone webbapplikation. Designad för föräldrar som vill skapa tydliga, visuella scheman som barn enkelt kan förstå.

## Teknisk Stack

- **Frontend:** Vanilla HTML/CSS/JavaScript (single-page application)
- **Backend:** Node.js proxy-server för OpenSymbols API-autentisering
- **Symbol-API:er:** 
  - OpenSymbols (60 000+ symboler, kräver API-nyckel via proxy)
  - SymboTalk (28 000+ symboler, öppen fallback)
- **LLM-integration:** Lokal LLM på `localhost:8081` för synonym-generering och översättning
- **Bildexport:** html2canvas för PNG-export
- **Lagring:** localStorage för scheman och favoriter

## API-nycklar och Konfiguration

- **OpenSymbols Secret:** `c4b6bf27cd5a97dece252a2e`
- **Proxy-server:** `localhost:3001`
- **LLM-server:** `localhost:8081/v1/chat/completions`

## Implementerade Funktioner

### Kärnfunktionalitet
- Flexibelt antal dagar (1-7)
- Lägg till/redigera/ta bort aktiviteter
- Analog klocka för tidsvisning (inte digitala siffror)
- Färgkodning: morgon (gul), dag (blå), kväll (lila)
- Drag-and-drop för att flytta aktiviteter mellan dagar

### Symbolsökning
- Söker först på svenska via SymboTalk
- Översätter till engelska (LLM eller inbyggd ordbok med 80+ ord)
- Visar synonymer/söktermer under sökfältet
- Presenterar 8-12 symbolalternativ

### Schema-hantering
- Spara flera scheman (t.ex. "Franks schema", "Fridas schema")
- Dropdown för att välja/ladda schema
- "Spara som..." för nya scheman
- Ta bort scheman
- Auto-sparar ändringar

### Favoriter
- Spara återkommande aktiviteter som favoriter
- Drag-and-drop favoriter till valfri dag
- Ta bort favoriter med X-knapp

### Export/Delning
- "Dela bild" - exporterar som PNG utan UI-element
- Optimerad för stora symboler och minimalt whitespace
- Endast symboler visas i export (text dold)
- Print-header med schemanamn och datum

### Sammanslagna Aktiviteter
- Automatisk gruppering av aktiviteter med samma tid
- EN klocka per grupp
- Symboler visas horisontellt i rad (förminskade)
- Individuella redigerings- och borttagningsknappar per symbol
- Tooltips visar alla aktivitetsnamn

### Rebus/Regler-sektion
- Tidsobundna regler med symboler (t.ex. `[Bil] + [< 30 min] → [iPad-X]`)
- Operatörer: `+`, `→`, `=`, `≠`, `<`, `>`, `≤`, `≥`
- Fördefinierade villkor: tid, antal, ja/nej
- Symboler kan strykas över (förbjuden)
- Full regel-byggare modal med sökning
- Villkor syns i export (viktigt för rebus-logik)

### Avancerade Funktioner
- **Precis redigering:** Individuella knappar för varje symbol i grupperade aktiviteter
- **Ersätt-kopiering:** Kopiera dag ersätter hela måldagens innehåll (inte lägger till)
- **Optimerad export:** Symbol-only bilder med minimalt whitespace
- **Import/Export:** JSON-export och import för backup och delning mellan föräldrar

## Filstruktur

```
dagsplanerare/
├── index.html      # Huvudapplikation (allt i en fil)
├── server.js       # Node.js proxy för OpenSymbols API
├── package.json    # NPM-konfiguration
├── README.md       # Projekt-dokumentation
└── agent.md        # Agent-dokumentation (denna fil)
```

## Köra Applikationen

```bash
cd dagsplanerare
node server.js
# Öppna http://localhost:3001
```

## Viktiga Kodstrukturer

### Data-struktur för Schedule
```javascript
let schedule = {
    name: 'Mitt schema',
    startDate: '2026-01-31',
    numDays: 5,
    days: {
        '2026-01-31': [
            { time: '08:00', text: 'Frukost', symbol: 'url/to/image.png' }
        ]
    },
    rules: [
        {
            id: 'rule_123',
            symbols: [
                { type: 'symbol', url: 'car.png', label: 'Bilresa' },
                { type: 'operator', value: '+' },
                { type: 'condition', value: '< 30 min' },
                { type: 'operator', value: '→' },
                { type: 'symbol', url: 'ipad.png', label: 'iPad', crossed: true }
            ]
        }
    ]
};
```

### Import/Export Functions
### Viktiga Funktioner
- `renderActivities(dayId)` - Renderar aktiviteter med gruppering
- `renderRules()` - Renderar regler i rebus-format
- `groupActivitiesByTime()` - Grupperar aktiviteter med samma tid
- `copyDayToNext()` - Ersätter måldagens innehåll
- `exportAsImage()` - Skapar bild utan UI-element
- `searchSymbols()` - Söker symboler via API:er
- `exportAsJSON()` - Exporterar alla scheman och favoriter som JSON
- `importFromJSON()` - Importerar JSON-fil med validering
- `performImport()` - Hanterar merge/replace av data
- `validateImportData()` - Validerar filformat

### CSS Klasser
- `.activity` - Enkel aktivitet
- `.activity-group` - Sammanslagna aktiviteter
- `.activity-symbol-small-wrapper` - Individuella symboler i grupp
- `.rule-item` - Rebus-regel
- `.export-mode` - Klass applicerad vid bildexport

## Export-optimering

Export-mode döljer all text och UI-element för ren symbol-bild:
- `.activity-content`, `.activity-text` - Aktivitetstext dold
- `.activity-actions`, `.activity-symbol-actions` - Knappar dolda
- `.header`, `.controls`, `.favorites-panel` - UI-paneler dolda
- Symboler blir centrifierade när text är dold
- Regler visas med villkorstext (viktigt för rebus-logik)

## Sammanslagna Aktiviteter - Detaljer

När aktiviteter har samma tid grupperas de automatiskt:
- **Visuellt:** Symboler visas horisontellt med en klocka
- **Interaktion:** Hover på varje symbol visar ✏️ och 🗑️
- **Redigering:** Klicka på ✏️ för att redigera specifik aktivitet
- **Borttagning:** Klicka på 🗑️ för att ta bort specifik aktivitet
- **Export:** Visas som horisontella symboler utan knappar

## Regler-system - Detaljer

Rebus-regler möjliggör komplexa villkor:
- **Symboler:** Bilder från symbol-sökning
- **Operatorer:** Matematiska logiska symboler
- **Villkor:** Tidsbegränsningar, antal, ja/nej
- **Kryss:** Markera symboler som förbjudna
- **Export:** Villkorstext syns för att bevara logiken

## Framtida Utvecklingsmöjligheter

1. **Ångra-funktion** istället för confirm-dialoger
2. **Import/Export** av scheman som JSON-fil
3. **PWA-stöd** för offline-användning
4. **Fler villkorstyper** i regler (temperatur, veckodag, etc.)
5. **Avancerad gruppering** av aktiviteter (t.ex. "efter lunch")
6. **Flerspråkighet** för hela applikationen
7. **Ljud-stöd** för aktiviteter
8. **Kalender-integration** med Google Calendar etc.
9. **Avancerad regler-logik** med AND/OR operatorer
10. **Mallar** för vanliga scheman (skolvecka, helg etc.)

## Debugging och Testning

### Vanliga Problem
- **Symbol-sökning fungerar inte:** Kontrollera att proxy-server körs på localhost:3001
- **Export-bild är tom:** Kontrollera html2canvas-biblioteket laddas korrekt
- **Regler sparas inte:** Verifiera localStorage fungerar i webbläsaren
- **Sammanslagna aktiviteter visas inte:** Kontrollera att aktiviteter har exakt samma tid
- **Redigering av grupperade aktiviteter:** Hover över symbol för att se knappar

### Testfall
1. Skapa 2+ aktiviteter med samma tid → ska grupperas
2. Hover på symboler i grupp → ska visa ✏️ och 🗑️
3. Klicka ✏️ på symbol → ska öppna redigering för den aktiviteten
4. Skapa regel med symboler → ska synas i export med villkor
5. "Dela bild" → ska bara visa symboler, ingen text
6. Dra favorit till dag → ska läggas till som ny aktivitet
7. Ändra antal dagar → ska uppdatera layout dynamiskt
8. Kopiera dag → ska ersätta måldagens innehåll helt

## Användartips

### Grundläggande användning
1. **Favoriter:** Klicka på ♡ på aktiviteter för snabb återanvändning
2. **Gruppering:** Lägg aktiviteter med samma tid för automatisk gruppering  
3. **Regler:** Använd villkor som `< 30 min` för tidsbaserade regler
4. **Export:** "Dela bild" skapar ren symbol-bild för barnen
5. **Scheman:** "Spara som..." för att hantera flera olika scheman

### Avancerade funktioner
1. **Precis redigering:** I grupperade aktiviteter, hover och klicka ✏️ på specifik symbol
2. **Ersätt-kopiering:** Använd 📋→ för att ersätta hela dagens innehåll
3. **Rebus-logik:** Kombinera symboler, operatörer och villkor för komplexa regler
4. **Symbol-sökning:** Använd svenska ord, appen översätter automatiskt

## Tekniska Anteckningar

- `confirm()` är borttagen (blockeras av webbläsare)
- Symbolbilder laddas från externa URL:er (CORS kan vara problem vid export)
- html2canvas kan ha problem med externa bilder vid export
- localStorage används - scheman försvinner om användaren rensar webbläsardata
- Ingen server-side lagring - allt är lokalt
- Proxy-server hanterar API-nycklar säkert
- Drag-and-drop använder HTML5 standard API

## GitHub Repository

Projektet finns på: `https://github.com/[username]/dagsplanerare`

### Installation och körning från GitHub
```bash
git clone https://github.com/[username]/dagsplanerare.git
cd dagsplanerare
npm install  # Om package.json har dependencies
node server.js
# Öppna http://localhost:3001
```

---

**Version:** 1.2.0  
**Senast uppdaterad:** 2026-01-31  
**Status:** Production-ready med alla kärnfunktioner implementerade  
**GitHub:** https://github.com/[username]/dagsplanerare