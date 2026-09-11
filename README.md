# 🤡 Lietuvos / Tautos Bukiausias – Balsavimo Sistema (2026)

[![Version](https://img.shields.io/badge/version-v1.3.0-amber.svg)](https://github.com/tommardev/tautos-bukiausias-balsavimas/releases)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Hosting](https://img.shields.io/badge/hosting-Firebase_Live-orange.svg)](https://balsavimas-vaciukai.web.app)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

Smagi, moderni ir interaktyvi vieno puslapio atvirojo kodo balsavimo platforma, įkvėpta naujo TV3 projekto **„Tautos bukiausias“** (vedėjai Mantas Katleris ir Mantas Bartuševičius).

Sukurta draugų kompanijai ir bendruomenei: balsuokite už mėgstamiausius personažus, stebėkite rezultatus realiu laiku per interaktyvią diagramą bei lyderių lentelę ir skaidriai sekite atiduotus balsus.

---

## 🌐 Gyvos Nuorodos (Live Deployments)

- **Gamybinis adresas:** [https://balsavimas-vaciukai.web.app](https://balsavimas-vaciukai.web.app)
- **Atsarginis adresas:** [https://balsavimas-vaciukai.firebaseapp.com](https://balsavimas-vaciukai.firebaseapp.com)
- **Išeities kodas:** [https://github.com/tommardev/tautos-bukiausias-balsavimas](https://github.com/tommardev/tautos-bukiausias-balsavimas)

---

## 🚀 Pagrindinės Savybės

1. **Privalomas vardo įvedimas**: Kiekvienas balsuojantysis nurodo savo vardą, kuris įrašomas į skaidrų audito žurnalą („Paskutiniai balsai“).
2. **Iki 3 pasirinkimų**: Galima pasirinkti nuo 1 iki 3 kandidatų vienu balsavimu su patogia fiksuota apatine valdymo juosta.
3. **Komiški TV laidos personažai**: Visi TV3 laidos „Tautos bukiausias“ dalyviai su originaliomis komiškomis pravardėmis, eterio perlais ir frazėmis.
4. **Naujo kandidato pasiūlymas**: Galimybė akimirksniu įtraukti savo draugą ar kitą žinomą veidą į kandidatų sąrašą per modalinį langą.
5. **Chart.js rezultatų diagrama ir lyderių lentelė**: Interaktyvi stulpelinė diagrama su neapkarpytomis žymomis bei dinamiška lyderių rikiuotė su procentais ir Top 3 apdovanojimų medaliais.
6. **Skaidrus audito žurnalas**: Išsamus paskutinių balsų sąrašas su laiko žymomis ir pasirinkimais.
7. **Momentinė Firebase Firestore sinchronizacija**: Visi atiduoti balsai realiu laiku per WebSocket'us (~100ms) sinchronizuojami tarp visų telefonų, kompiuterių ir naršyklių be jokių limitų.
8. **Dizaino inžinerijos kokybė (Emil Kowalski standartas)**: Nulis dirbtinio triukšmo (anti-slop), taktilinis mygtukų atsakas (`:active { transform: scale(0.97) }`), greiti perėjimai (< 220ms) bei prieinamumo palaikymas (`prefers-reduced-motion`).
9. **Versijos sekimas ir talpyklos apsauga**: Poraštėje realiu laiku rodoma diegimo versija (`v1.3.0`), o diegimo taisyklės automatiškai atnaujina naršyklės talpyklą (Cache-Control: no-cache).

---

## 💻 Vietinis Paleidimas (Local Development)

Projektas sukurtas pagal Vanilla Web standartą — nereikia jokių kompiliavimo žingsnių ar karkasų.

1. **Klonuokite saugyklą:**
   ```bash
   git clone https://github.com/tommardev/tautos-bukiausias-balsavimas.git
   cd tautos-bukiausias-balsavimas
   ```

2. **Paleiskite statinį serverį:**
   ```bash
   npx -y serve .
   ```
   *arba tiesiog atverkite `index.html` bet kurioje šiuolaikinėje naršyklėje.*

3. Atverkite `http://localhost:3000`.

---

## 📦 Kaip atnaujinti svetainę (Deploy)

Norėdami paskelbti naujausią versiją į Firebase Hosting:

```powershell
.\deploy-firebase.ps1
```

arba per npm skriptą / tiesiogiai:

```bash
npx -y firebase-tools@latest deploy --only hosting
```

---

## 🛠️ Architektūra ir Technologijos

- **HTML5 & CSS3:** Semantinis žymėjimas, moduliniai stiliai (`styles/tokens.css`, `styles/components/`, `styles/responsive.css`).
- **JavaScript (ES2022+):** Gryni vietiniai ES moduliai (`src/main.js`, `src/state/`, `src/services/`, `src/ui/`, `src/utils/`).
- **Išorinės bibliotekos (CDN):** Chart.js 4.4.7 + chartjs-plugin-datalabels, Canvas Confetti 1.9.3.
- **Debesis:** RESTful API debesų sinchronizavimas + Firebase Hosting.

---

## 🤝 Prisidėjimas (Contributing)

Projektas yra atvirojo kodo! Laukiame klaidų pataisymų, dizaino patobulinimų ir idėjų.
Prieš siųsdami pull request'ą, prašome perskaityti:
- [Prisidėjimo gaires (CONTRIBUTING.md)](CONTRIBUTING.md)
- [Elgesio kodeksą (CODE_OF_CONDUCT.md)](CODE_OF_CONDUCT.md)
- [Saugumo politiką (SECURITY.md)](SECURITY.md)

---

## 📄 Licencija

Šis projektas licencijuotas pagal **[MIT Licenciją](LICENSE)** – galite laisvai naudoti, modifikuoti ir platinti.

---

## ⚠️ Teisinė Pastaba / Disclaimer

Šis projektas yra nepriklausoma humoristinė parodija ir draugų kompanijos pramoga, įkvėpta TV3 laidos. Visi prekių ženklai ir laidos elementai priklauso jų teisėtiems savininkams.
