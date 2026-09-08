# 🤡 Lietuvos / Tautos Bukiausias – Balsavimo Sistema (2026)

Smagi, moderni ir interaktyvi vieno puslapio balsavimo platforma, įkvėpta naujo TV3 projekto **„Tautos bukiausias“** (vedėjai Mantas Katleris ir Mantas Bartuševičius).

Ši sistema sukurta draugų kompanijai, kad galėtų balsuoti, sekti rezultatus realiu laiku ir smagiai diskutuoti, kas nusipelnė „Bukiausiojo“ karūnos!

## ⚡ Pagrindinės Savybės

1. **Privalomas vardo įvedimas**: Kiekvienas balsuojantysis privalo nurodyti savo vardą, kad matytųsi skaidrus audito žurnalas („Kas už ką balsavo“).
2. **Iki 3 pasirinkimų**: Galima pasirinkti nuo 1 iki 3 kandidatų vienu metu.
3. **Tikri TV šou dalyviai**: Visi 12 TV3 laidos „Tautos bukiausias“ dalyvių su jų originaliomis komiškomis pravardėmis, eterio klaidomis ir frazėmis (Oksana „Pikel“, Aušra Seibutytė-Maldeikienė, Simona „Greit Nebe Lipnė“, Danas Rapšys su bandelėmis, Žilvinas Grigaitis ir kt.).
4. **Naujo kandidato pridėjimas**: Galimybė akimirksniu pasiūlyti savo draugą ar kitą žinomą veidą į kandidatų sąrašą.
5. **Modernios grafinės kolonos**: Animuotos, 3D stiliaus vertikalios ir horizontalios diagramos su procentais ir balsų skaičiumi.
6. **Gėdos pakyla (Top 3)**: Pirmosios 3 vietos su auksiniais klozetais ir „dunce cap“ kepuraitėmis.
7. **Balsavimo žurnalas (Kas už ką balsavo)**: Išsamus sąrašas su laiko žymomis, vardo paieška ir pasirinkimais.
8. **Bendras debesų sinchronizavimas**: Rezultatai saugomi debesyje per `api.restful-api.dev` ir sinchronizuojami realiu laiku visiems draugams, atsidariusiems nuorodą (su automatiniu 5 sek. atnaujinimu bei vietine atsargine kopija per `localStorage`).
9. **Garso efektai ir konfeti**: Žaismingi garso signalai (per Web Audio API) ir konfeti pliūpsnis atidavus balsą.

## 🚀 Paleidimas vietoje

Atidarykite `index.html` bet kurioje naršyklėje arba paleiskite vietinį serverį:

```bash
# Naudojant Python:
python -m http.server 8000

# Arba npx serve:
npx serve .
```

## 🌐 Publikavimas

Projektas sukonfigūruotas greitam publikavimui į **here.now** naudojant įdiegtą `here-now` įrankį.
