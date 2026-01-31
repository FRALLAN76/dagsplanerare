# Dagsplanerare för Barn

En visuell dagsplanerare för barn med symbolstöd, byggd som en webbapplikation för att hjälpa föräldrar skapa tydliga, visuella scheman som barn enkelt kan förstå.

## 🌟 Funktioner

### 📅 Grundläggande Schema-hantering
- **Flexibelt antal dagar:** 1-7 dagar med anpassningsbara datum
- **Analog klockvisning:** Barnvänliga klockor istället för digitala tider
- **Färgkodning:** Morgon (gul), Dag (blå), Kväll (lila) för visuell struktur
- **Drag & Drop:** Enkelt att flytta aktiviteter mellan dagar

### 🔍 Symbol-sökning
- **90 000+ symboler:** Tillgång till OpenSymbols och SymboTalk
- **Svensk sökning:** Sök på svenska, automatisk översättning till engelska
- **Smart sökning:** Synonymer och alternativa söktermer visas

### 💾 Schema-hantering
- **Flera scheman:** Spara och byt mellan olika scheman (t.ex. "Franks schema", "Fridas schema")
- **Auto-spara:** Ändringar sparas automatiskt
- **Favoriter:** Snabbåtkomst till återkommande aktiviteter

### 🔀 Sammanslagna Aktiviteter
- **Automatisk gruppering:** Aktiviteter med samma tid grupperas automatiskt
- **Individuell redigering:** Redigera eller ta bort enskilda aktiviteter i grupper
- **Smart layout:** Symboler visas horisontellt med gemensam klocka

### 🧩 Rebus/Regler-system
- **Tidsobundna regler:** Skapa villkor som `[Bil] + [< 30 min] → [iPad-X]`
- **Operatörer:** Använd matematiska symboler (+, →, =, ≠, <, >, ≤, ≥)
- **Villkor:** Tidsgränser, antal, ja/nej-villkor
- **Förbud:** Stryk över symboler för att visa vad som inte är tillåtet

### 📱 Export & Delning
- **Symbol-bild:** Exportera som PNG med bara symboler (ingen text)
- **Optimerad layout:** Maximal symbolstorlek och minimalt whitespace
- **Utskriftsvänlig:** Perfekt för att skriva ut och sätta på kylskåpet

## 🚀 Snabbstart

### Förutsättningar
- Node.js (version 14 eller senare)
- Modern webbläsare med JavaScript-stöd

### Installation
```bash
# Klona repository
git clone https://github.com/[username]/dagsplanerare.git
cd dagsplanerare

# Starta servern
node server.js
```

### Användning
1. Öppna din webbläsare och gå till `http://localhost:3001`
2. Skapa ditt första schema genom att:
   - Välja antal dagar och startdatum
   - Klicka "➕ Lägg till aktivitet" för att lägga till symboler
   - Använd sökningen för att hitta passande symboler
3. Spara ditt schema med "💾 Spara som..."
4. Exportera med "🖼️ Dela bild" för en ren symbol-bild

## 📸 Exempelbilder

### Grundläggande schema
*Exempel på grundläggande schema med aktiviteter*

### Sammanslagna aktiviteter
*Exempel på sammanslagna aktiviteter med samma tid*

### Rebus-regler
*Exempel på rebus-regler med villkor*

### Exporterad bild
*Exempel på exporterad symbol-bild utan text*

## 🏗️ Teknisk Arkitektur

### Frontend
- **Pure Vanilla JavaScript:** Inga ramverk för maximal prestanda
- **Responsive Design:** Fungerar på mobil, tablet och desktop
- **LocalStorage:** All data sparas lokalt för integritet

### Backend
- **Node.js Proxy:** Säker hantering av OpenSymbols API-nycklar
- **Symbol-integration:** OpenSymbols (60 000+) + SymboTalk (28 000+)
- **Fallback:** Flera symbolkällor för maximal täckning

### Data-struktur
```javascript
{
    name: "Franks schema",
    startDate: "2026-01-31",
    numDays: 5,
    days: {
        "2026-01-31": [
            { time: "08:00", text: "Frukost", symbol: "url/to/symbol.png" }
        ]
    },
    rules: [
        {
            id: "rule_123",
            symbols: [
                { type: "symbol", url: "car.png", label: "Bilresa" },
                { type: "operator", value: "+" },
                { type: "condition", value: "< 30 min" },
                { type: "operator", value: "→" },
                { type: "symbol", url: "ipad.png", label: "iPad", crossed: true }
            ]
        }
    ]
}
```

## 🎯 Användningsfall

### För Föräldrar
- **Daglig rutin:** Visa morgonrutin med symboler för att minska stress
- **Veckoplanering:** Ge översikt över hela veckans aktiviteter
- **Regler och belöning:** Skapa tydliga regler för skärmtid och lektid

### För Specialpedagoger
- **Visualisering:** Hjälpa barn med autism eller ADHD att förstå rutiner
- **Förutsägbarhet:** Minska ångest genom att visa vad som ska hända
- **Kommunikation:** Använd som kommunikationsstöd för icke-verbala barn

### För Förskolor/Skolor
- **Dagsplanering:** Visa dags-schema för hela klassen
- **Struktur:** Ge tydlig struktur för lektioner och raster
- **Inkludering:** Stötta elever med olika behov

## 🛠️ Konfiguration

### OpenSymbols API-nyckel

Servern har en inbyggd API-nyckel. För att använda din egen:

```bash
export OPENSYMBOLS_SECRET=din_nyckel_här
node server.js
```

### Lokal LLM (valfritt)

För förbättrad översättning och synonymer kan du ansluta en lokal LLM:

- **Endpoint:** `http://localhost:8081/v1/chat/completions`
- **Kompatibelt:** OpenAI API-format
- **Fungerar med:** llama.cpp, ollama, LM Studio, etc.

## 📄 API Endpoints

| Endpoint | Beskrivning |
|----------|-------------|
| `GET /` | Huvudapplikationen |
| `GET /api/symbols?q=breakfast&locale=en` | Sök symboler |
| `GET /api/health` | Hälsokontroll |

## 🤝 Bidra

Vi välkomnar bidrag! Här är några sätt att hjälpa till:

### Buggrapporter
- Öppna ett [issue](https://github.com/[username]/dagsplanerare/issues) och beskriv problemet
- Inkludera webbläsare, version och steg för att återskapa

### Funktionsförslag
- Skapa ett [issue](https://github.com/[username]/dagsplanerare/issues) med din idé
- Beskriv användningsfallet och fördelarna

### Kodbidrag
1. Forka detta repository
2. Skapa en feature branch (`git checkout -b feature/amazing-feature`)
3. Committa dina ändringar (`git commit -m 'Add amazing feature'`)
4. Pusha till branchen (`git push origin feature/amazing-feature`)
5. Öppna en Pull Request

## 🛠️ Utveckling

### Lokal utveckling
```bash
# Kör i utvecklingsläge
node server.js

# Testa olika webbläsare
# (Manuell testning rekommenderas)
```

### Projektstruktur
```
dagsplanerare/
├── index.html          # Huvudapplikationen (all kod i en fil)
├── server.js           # Node.js proxy för symbol-API:er
├── package.json        # Projekt-metadata och scripts
├── README.md           # Denna fil
├── agent.md            # Detaljerad teknisk dokumentation
└── docs/               # Ytterligare dokumentation
```

## 📄 Licens

Detta projekt är licensierat under MIT License - se [LICENSE](LICENSE) filen för detaljer.

## 🙏 Tack

- **OpenSymbols** För fantastisk symbol-bibliotek och API
- **SymboTalk** För ytterligare symbol-resurser
- **html2canvas** För bildexport-funktionalitet
- **Familjer och specialpedagoger** För feedback och idéer

## 📞 Kontakt

- **Issues:** [GitHub Issues](https://github.com/[username]/dagsplanerare/issues)
- **Diskussion:** [GitHub Discussions](https://github.com/[username]/dagsplanerare/discussions)

---

**Skapat med ❤️ för att göra vardagen enklare för barn och deras familjer**

[![GitHub stars](https://img.shields.io/github/stars/[username]/dagsplanerare.svg?style=social&label=Star)](https://github.com/[username]/dagsplanerare)
[![GitHub forks](https://img.shields.io/github/forks/[username]/dagsplanerare.svg?style=social&label=Fork)](https://github.com/[username]/dagsplanerare/fork)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

*Symboler från [OpenSymbols](https://www.opensymbols.org) och [ARASAAC](https://arasaac.org) under respektive licenser.*
