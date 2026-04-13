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
    const t = translations[currentLang] || translations['pl'];
    
    // 1. AKTUALIZACJA TEKSTÓW STATYCZNYCH (PRZYWRÓCONE)
    document.title = t.title;
    document.getElementById('t-main-title').innerText = t.title;
    document.getElementById('t-election-title').innerText = t.election;
    document.getElementById('t-market-title').innerText = t.market;
    document.getElementById('t-rating-title').innerText = t.statusTitle;
    document.getElementById('t-footer').innerText = t.footer;
    document.getElementById('ticker-content').innerText = t.news + t.news;

    // Przywrócenie Legendy
    document.getElementById('legend-content').innerHTML = `
        <div style="margin-bottom:5px;"><span style="color:#166534">✓</span> ${t.aaa}</div>
        <div style="margin-bottom:5px;"><span style="color:#475569">•</span> ${t.bbb}</div>
        <div><span style="color:#E52B50">✕</span> ${t.d}</div>
    `;

    // Przywrócenie bloku Wyborów
    const now = new Date();
    const getDiff = (d1, d2) => Math.floor(Math.abs(d1 - d2) / (1000 * 60 * 60 * 24));
    document.getElementById('election-data-box').innerHTML = `
        <div><strong>${t.last}:</strong> ${t.parl} 15.10.2023 (${getDiff(now, new Date('2023-10-15'))} ${t.days})</div>
        <div><strong>${t.next}:</strong> ${t.parl} X 2027 (${t.about} ${getDiff(new Date('2027-10-17'), now)} ${t.days})</div>
    `;

    // 2. POBIERANIE DANYCH RYNKOWYCH
    try {
        const nbpRes = await fetch('https://api.nbp.pl/api/exchangerates/tables/A/?format=json').then(r => r.json());
        const eur = nbpRes[0].rates.find(x => x.code === 'EUR').mid;
        const usd = nbpRes[0].rates.find(x => x.code === 'USD').mid;
        
        document.getElementById('rates').innerHTML = `
            <div style="color:#475569; line-height:1.6; font-size:14px;">
                <div style="margin-bottom: 2px;">EUR: <b>${eur}</b> | USD: <b>${usd}</b></div>
                <div>
                    ${t.inflation}: <b>3.2%</b> | ${t.gdp}: <b>+2.8%</b><br>
                    ${t.deficit}: <b style="color:var(--amarant)">5.1% ${currentLang === 'de' ? 'BIP' : 'GDP'}</b> 
                    <span style="font-size:11px; color:#94a3b8; display:block; margin-top:2px;">/ 182 mld PLN (${t.period})</span>
                </div>
            </div>`;
    } catch (e) { console.error("Market data error"); }

    // 3. POBIERANIE PARTII I LOGO
    try {
        const res = await fetch('data.json');
        const config = await res.json();
        const { data: voteData } = await supabaseClient.from('votes').select('*');

        app.innerHTML = '';
        config.parties.forEach(p => {
            const votes = voteData?.find(v => v.party_id === p.id)?.count || 0;
            const partyName = p[`name_${currentLang}`] || p.name_pl;
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <button class="vote-btn" onclick="vote('${p.id}')" style="width:100%; display:flex; justify-content:space-between; padding:8px; font-family:var(--font-data); font-size:10px; cursor:pointer; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; margin-bottom:15px;">
                    <span>${t.sentiment}</span> <b id="v-${p.id}">${votes}</b>
                </button>
                <div style="height:60px; display:flex; align-items:center; justify-content:center; margin-bottom:10px; overflow:hidden;">
                    <img src="${p.logo}" 
                         alt="${partyName}" 
                         style="max-height:100%; max-width:100%; object-fit:contain;"
                         onerror="this.onerror=null; this.outerHTML='<span style=\'font-family:var(--font-data); font-weight:700; font-size:12px; color:#94a3b8; text-align:center;\'>${partyName}</span>';">
                </div>
                <h3 style="text-align:center; margin:0 0 15px 0; font-size:1.1em;">${partyName}</h3>
                <ul style="list-style:none; padding:0; margin:0; flex-grow:1;">
                    ${p.promises.map(pr => `
                        <li class="${pr.status}">
                            <span style="font-weight:bold; width:15px; display:inline-block;">${pr.status==='done'?'✓':(pr.status==='failed'?'✕':'•')}</span>
                            <a href="${pr.url}" target="_blank" style="text-decoration:none; color:inherit;">${pr[`desc_${currentLang}`] || pr.desc_pl}</a>
                        </li>
                    `).join('')}
                </ul>
            `;
            app.appendChild(card);
        });
    } catch (e) { app.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:50px;">Błąd ładowania danych.</div>'; }
}

async function vote(id) {
    const { error } = await supabaseClient.rpc('increment_vote', { row_id: id });
    if (!error) {
        const el = document.getElementById(`v-${id}`);
        if (el) el.innerText = parseInt(el.innerText) + 1;
    }
}
document.addEventListener('DOMContentLoaded', init);
