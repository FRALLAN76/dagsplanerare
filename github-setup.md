# GitHub Setup Instructions

## Steg 1: Skapa Repository på GitHub

1. Gå till https://github.com/frallan76/new
2. **Repository name:** `dagsplanerare`
3. **Description:** `En visuell dagsplanerare för barn med symbolstöd. Byggd för att hjälpa föräldrar skapa tydliga, visuella scheman.`
4. **Visibility:** Välj **Private**
5. **Add a README file:** Avmarkera (vi har redan en)
6. **Add .gitignore:** Avmarkera
7. **Choose a license:** Välj MIT License

Klicka på **Create repository**.

## Steg 2: Pusha koden

När repositoryt är skapat, kör dessa kommandon i din terminal:

```bash
cd /home/frallan/dagsplanering/claudes
git remote set-url origin https://github.com/frallan76/dagsplanerare.git
git push -u origin main
```

Du kommer att bli ombedd att logga in med GitHub.

## Steg 3: Verifiera

Gå till https://github.com/frallan76/dagsplanerare för att se alla filer!

## 🎉 Klart!

Nu har du:
- ✅ Fullständigt dokumenterat projekt
- ✅ Privat GitHub repository
- ✅ Professionell README.md och agent.md
- ✅ Klar för vidareutveckling och delning

## Framtida användning

```bash
# För att komma åt repositoryt i framtiden
cd /home/frallan/dagsplanering/claudes
git pull origin main    # Hämta ändringar
git add .              # Lägg till nya filer
git commit -m "din ändring"
git push                # Skicka ändringar
```