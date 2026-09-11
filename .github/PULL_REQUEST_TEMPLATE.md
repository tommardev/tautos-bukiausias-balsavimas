## Aprašymas (Description)

Trumpai aprašykite, kokią problemą sprendžia šis PR arba kokį funkcionalumą prideda.

## Pakeitimų tipas (Type of change)

- [ ] Klaidos pataisymas (`fix:`)
- [ ] Nauja funkcija (`feat:`)
- [ ] Refaktorizavimas (`refactor:`)
- [ ] Dizaino/stiliaus patobulinimas (`style:`)
- [ ] Dokumentacijos atnaujinimas (`docs:`)
- [ ] Priežiūra / konfigūracija (`chore:`)

## Kokybės ir anti-slop patikros (Checklist)

- [ ] Pakeitimai ištestuoti lokaliai naršyklėje
- [ ] Nėra perteklinių animacijų ar AI slop atributų (blur sferų, neonų, emoji ant mygtukų)
- [ ] Judesio perėjimai trunka < 220ms, nenaudojamas `transition: all`
- [ ] Visi vartotojo įvesties laukai apsaugoti nuo XSS (`escapeHTML`)
- [ ] Kodas laikosi Vanilla ES2022+ modulių architektūros (be papildomų kompiliavimo įrankių)
- [ ] Atitinka prieinamumo reikalavimus (WCAG 2.2 AA)
