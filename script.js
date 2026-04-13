const SB_URL = 'https://amixcppknszjfscnepnx.supabase.co';
const SB_KEY = 'sb_publishable_8pZgzv2BXthAUoBppO8U3A_edhabo2J';
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

let currentLang = localStorage.getItem('lang') || 'pl';

const translations = {
    pl: {
        title: "terminal obywatelski", election: "WYBORY", last: "OSTATNIE", next: "NADCHODZĄCE",
        days: "dni", about: "za ok.", inflation: "Inflacja", gdp: "PKB", deficit: "Deficyt",
        period: "za rok 2025", market: "RYNEK I WSKAŹNIKI (LIVE)", statusTitle: "STATUSY RATINGOWE",
        aaa: "Realizacja (AAA)", bbb: "W procesie (BBB)", d: "Brak (D)", sentiment: "SENTYMENT",
        parl: "Parlamentarne", local: "Samorządowe",
        news: " PILNE: Polska gospodarka przyspiesza • GUS potwierdza spadek inflacji • Stabilizacja na rynkach światowych • Sejm proceduje nowe ustawy • ",
        footer: "© 2026 terminal obywatelski. Wszelkie prawa zastrzeżone. Dane: NBP, MF, SEJM."
    },
    en: {
        title: "citizen terminal", election: "ELECTIONS", last: "LAST", next: "UPCOMING",
        days: "days", about: "approx.", inflation: "Inflation", gdp: "GDP", deficit: "Deficit",
        period: "for 2025", market: "MARKET INDICATORS (LIVE)", statusTitle: "RATING STATUS",
        aaa: "Completed (AAA)", bbb: "In progress (BBB)", d: "Failed (D)", sentiment: "SENTIMENT",
        parl: "General", local: "Local",
        news: " BREAKING: Polish economy gains momentum • Stats office confirms inflation drop • Global markets remain stable • Parliament processes bills • ",
        footer: "© 2026 citizen terminal. All rights reserved. Data: NBP, MF, SEJM."
    },
    de: {
        title: "Bürgerterminal", election: "WAHLEN", last: "LETZTE", next: "NÄCHSTE",
        days: "Tage", about: "ca.", inflation: "Inflation", gdp: "BIP", deficit: "Defizit",
        period: "für 2025", market: "MARKTINDIKATOREN (LIVE)", statusTitle: "RATING-STATUS",
        aaa: "Erledigt (AAA)", bbb: "In Bearbeitung (BBB)", d: "Fehlgeschlagen (D)", sentiment: "STIMMUNG",
        parl: "Parlamentswahlen", local: "Kommunalwahlen",
        news: " EILMELDUNG: Polnische Wirtschaft nimmt an Fahrt auf • BIP-Prognosen stabil • Rückgang der Inflation bestätigt • Neue Gesetze im Parlament • ",
        footer: "© 2026 Bürgerterminal. Alle Rechte vorbehalten. Daten: NBP, MF, SEJM."
    }
};

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    init();
}

async function init() {
    const app = document.getElementById('app');
    const ratesEl = document.getElementById('rates');
    const t = translations[currentLang]
