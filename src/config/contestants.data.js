/**
 * Default Contestant Roster (TV3 „Tautos bukiausias“ 2026)
 */
export const DEFAULT_CONTESTANTS = [
  {
    id: "oksana",
    name: "Oksana Pikul",
    alias: "„Oksana Pikel“",
    tagline: "Eterio titruose virto „Pikel“, o Neilą Armstrongą supainiojo su Gagarinu Mėnulyje!",
    avatar: "💄",
    category: "pupil",
    categoryLabel: "Mados & Titrų Auka"
  },
  {
    id: "ausra",
    name: "Aušra Maldeikienė",
    alias: "„Brandas Maldeikienė (Seibutytė)“",
    tagline: "„Aš už nieką neatsakinga, aš galiu būti pati bukiausia, man dzin!“",
    avatar: "💶",
    category: "pupil",
    categoryLabel: "Ekonominė Filosofija"
  },
  {
    id: "simona",
    name: "Simona Lipnė",
    alias: "„Greit Nebe Lipnė“",
    tagline: "Trynukų mama ir eterio žvaigždė: „Lionei net konkurso nereikia, ana jau bukiausia“",
    avatar: "👶",
    category: "pupil",
    categoryLabel: "Influencerių Katedra"
  },
  {
    id: "danas",
    name: "Danas Rapšys",
    alias: "„Vandens Profesorius“",
    tagline: "Per pamokas slapčia valgė bandeles, o vandens paslaptys vis dar neįmintos!",
    avatar: "🏊",
    category: "pupil",
    categoryLabel: "Olimpinis Plaukimas"
  },
  {
    id: "zilvinas",
    name: "Žilvinas Grigaitis",
    alias: "„Šampano ir Lėktuvų Lordas“",
    tagline: "Lėktuvuose praleido pusę gyvenimo, mados ir sagų ekspertas bet kokiu oru.",
    avatar: "🥂",
    category: "pupil",
    categoryLabel: "Pasaulio Elitas"
  },
  {
    id: "ineta",
    name: "Ineta Stasiulytė",
    alias: "„Nežinojimo Deivė“",
    tagline: "Aistringa tango šokėja: „Faktų nežinojimas nė vieno nepaverčia blogu žmogumi!“",
    avatar: "💃",
    category: "pupil",
    categoryLabel: "Teatras & Šokiai"
  },
  {
    id: "ironvytas",
    name: "Vytautas Medineckas (Ironvytas)",
    alias: "„Dvi Pažymių Knygelės“",
    tagline: "3 metus turėjo 2 pažymių knygeles (vieną mamai, kitą mokytojams) ir 120 kg raumenų.",
    avatar: "💪",
    category: "pupil",
    categoryLabel: "Raumenų Reperis"
  },
  {
    id: "gabrielius",
    name: "Gabrielius Vagelis",
    alias: "„Mados Kankinys“",
    tagline: "Švarkai gigantiški, plaukai nepajudinami, o atsakymų ieškoma stiliuje.",
    avatar: "🎤",
    category: "pupil",
    categoryLabel: "Pop Scenos Auka"
  },
  {
    id: "agne",
    name: "Agnė Turskienė",
    alias: "„Maldeikienės Marti“",
    tagline: "Kibernetinio saugumo specialistė, bet anytos temperamento nesuvaldė.",
    avatar: "🛡️",
    category: "pupil",
    categoryLabel: "IT & Šeimyninė Karma"
  },
  {
    id: "kaniusonis",
    name: "Vytautas Kaniušonis",
    alias: "„Amžinas Avantiūristas“",
    tagline: "Teatro vilkas, kuris sutiko dalyvauti vos išgirdęs žodį „bukiausias“.",
    avatar: "🎩",
    category: "pupil",
    categoryLabel: "Kino Grandas"
  },
  {
    id: "joana",
    name: "Joana Bartaškienė",
    alias: "„58 Metai Aerobikos“",
    tagline: "Tikra energijos bomba: „Meilė gyvenimui į pensiją neina, smegenis pamaitinsim!“",
    avatar: "⚡",
    category: "pupil",
    categoryLabel: "Sporto Legenda"
  },
  {
    id: "rumsas",
    name: "Vytautas Rumšas Jr.",
    alias: "„Grimas Nepadės“",
    tagline: "„Jeigu esi durnas – joks TV grimas čia nepadės!“",
    avatar: "📺",
    category: "pupil",
    categoryLabel: "TV Vedėjų Elitas"
  },
  {
    id: "katleris",
    name: "Mantas Katleris (Mokytojas)",
    alias: "„Klasės Valandėlės Pirmūnas“",
    tagline: "Tikybos pamokų bėglys ir klasės valandėlių lyderis.",
    avatar: "👨‍🏫",
    category: "teacher",
    categoryLabel: "Mokytojų Taryba"
  },
  {
    id: "bartusevicius",
    name: "Mantas Bartuševičius (Mokytojas)",
    alias: "„Penktoko Matematika“",
    tagline: "Matematikos žinių turi lygiai tiek pat, kiek penktokas per vasaros atostogas.",
    avatar: "🧑‍🏫",
    category: "teacher",
    categoryLabel: "Mokytojų Taryba"
  }
];

export const INITIAL_VOTES = {
  oksana: 6,
  ausra: 5,
  simona: 7,
  danas: 3,
  zilvinas: 4,
  ineta: 2,
  ironvytas: 5,
  gabrielius: 3,
  agne: 2,
  kaniusonis: 2,
  joana: 2,
  rumsas: 6,
  katleris: 3,
  bartusevicius: 4
};

export const INITIAL_VOTER_LEDGER = [
  { voter: "Mantas K.", choices: ["oksana", "rumsas", "simona"], timestamp: "11:30" },
  { voter: "Karolis", choices: ["simona", "ausra", "ironvytas"], timestamp: "12:15" },
  { voter: "Monika", choices: ["oksana", "zilvinas", "gabrielius"], timestamp: "12:40" }
];
