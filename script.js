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
        parl: "Parlamentarne", local: "Samorządowe"
    },
    en: {
        title: "citizen terminal", election: "ELECTIONS", last: "LAST", next: "UPCOMING",
        days: "days", about: "approx.", inflation: "Inflation", gdp: "GDP", deficit: "Deficit",
        period: "for 2025", market: "MARKET INDICATORS (LIVE)", statusTitle: "RATING STATUS",
        aaa: "Completed (AAA)", bbb: "In progress (BBB)", d: "Failed (D)", sentiment: "SENTIMENT",
        parl: "General", local: "Local"
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
    const t = translations[currentLang];
    
    // UI Update
    document.title = t.title;
    document.getElementById('t-main-title').innerText = t.title;
    document.getElementById('t-election-title').innerText = t.election;
    document.getElementById('t-market-title').innerText = t.market;
    document.getElementById('t-rating-title').innerText = t.statusTitle;

    // Legend
    document.getElementById('legend-content').innerHTML = `
        <div class="legend-item"><span class="icon done">✓</span> ${t.aaa}</div>
        <div class="legend-item"><span class="icon pending">•</span> ${t.bbb}</div>
        <div class="legend-item"><span class="icon failed">✕</span> ${t.d}</div>
    `;

    // Election counters
    const now = new Date();
    const getDiff = (d1, d2
