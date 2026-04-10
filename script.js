const SB_URL = 'https://amixcppknszjfscnepnx.supabase.co';
const SB_KEY = 'sb_publishable_8pZgzv2BXthAUoBppO8U3A_edhabo2J';
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

let currentLang = localStorage.getItem('lang') || 'pl';

const translations = {
    pl: {
        title: "terminal obywatelski", election: "WYBORY", last: "OSTATNIE", next: "NADCHODZĄCE",
        days: "dni", about: "za ok.", inflation: "Inflacja", gdp: "PKB", deficit: "Deficyt",
        exec: "wykonanie za rok 2025", market: "RYNEK I WSKAŹNIKI (LIVE)", statusTitle: "STATUSY RATINGOWE",
        aaa: "Realizacja (AAA)", bbb: "W procesie (BBB)", d: "Brak (D)", sentiment: "SENTYMENT",
        parl: "Parlamentarne", local: "Samorządowe", footer: "© 2026 terminal obywatelski. Dane: NBP, MF, SEJM."
    },
    en: {
        title: "citizen terminal", election: "ELECTIONS", last: "LAST", next: "UPCOMING",
        days: "days", about: "in approx.", inflation: "Inflation", gdp: "GDP", deficit: "Deficit",
        exec: "2025 execution", market: "MARKET INDICATORS (LIVE)", statusTitle: "RATING STATUS",
        aaa: "Completed (AAA)", bbb: "In progress (BBB)", d: "Failed (D)", sentiment: "SENTIMENT",
        parl: "General", local: "Local", footer: "© 2026 citizen terminal. Data: NBP, MF, SEJM."
    }
};

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    init();
}

function updateElectionUI() {
    const t = translations[currentLang];
    const now = new Date();
    const getDiff = (d1, d2) => Math.floor(Math.abs(d1 - d2) / (1000 * 60 * 60 * 24));
    
    const d1 = getDiff(now, new Date('2023-10-15'));
    const d2 = getDiff(now, new Date('2024-04-07'));
    const d3 = getDiff(new Date('2027-10-17'), now);
    const d4 = getDiff(new Date('2029-04-08'), now);

    document.getElementById('election-data-box').innerHTML = `
        <div><strong>${t.last}:</strong> ${t.parl} 15.10.2023 (${d1} ${t.days}) | ${t.local} 07.04.2024 (${d2} ${t.days})</div>
        <div><strong>${t.next}:</strong> ${t.parl} X 2027 (${t.about} ${d3} ${t.days}) | ${t.local} IV 2029 (${t.about} ${d4} ${t.days})</div>
    `;
    
    document.getElementById('t-main-title').innerText = t.title;
    document.getElementById('t-election-title').innerText = t.election;
    document.getElementById('t-market-title').innerText = t.market;
    document.getElementById('t-rating-title').innerText = t.statusTitle;
    document.getElementById('t-footer').innerText = t.footer;
    document.getElementById('legend-content').innerHTML = `
        <div class="legend-item"><span class="icon done">✓</span> ${t.aaa}</div>
        <div class="legend-item"><span class="icon pending">•</span> ${t.bbb}</div>
        <div class="legend-item"><span class="icon failed">✕</span> ${t.d}</div>
    `;
}

async function init() {
    const app = document.getElementById('app');
    const ratesEl = document.getElementById('rates');
    const t = translations[currentLang];
    updateElectionUI();

    try {
        const nbpRes = await fetch('https://api.nbp.pl/api/exchangerates/tables/A/?format=json').then(r => r.json());
        const eur = nbpRes[0].rates.find(x => x.code === 'EUR').mid;
        const usd = nbpRes[0].rates.find(x => x.code === 'USD').mid;
        
        ratesEl.innerHTML = `
            <div style="border-bottom:1px dashed #e2e8f0; padding-bottom:6px; margin-bottom:6px; font-size:16px;">
                EUR: <b>${eur}</b> | USD: <b>${usd}</b>
            </div>
            <div style="color:#475569; line-height:1.6;">
                ${t.inflation}: <b>3.2%</b> | ${t.gdp}: <b>+2.8%</b><br>
                ${t.deficit}: <b style="color:var(--amarant)">5.1% PKB</b> 
                <span style="font-size:11px; color:#94a3b8;">(182 mld PLN / ${t.exec})</span>
            </div>`;

        const res = await fetch('data.json');
        const config = await res.json();
        const { data: voteData } = await supabaseClient.from('votes').select('*');

        app.innerHTML = '';
        config.parties.forEach(p => {
            const votes = voteData?.find(v => v.party_id === p.id)?.count || 0;
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <button class="vote-btn" onclick="vote('${p.id}')" style="width:100%; display:flex; justify-content:space-between; padding:8px; font-family:var(--font-data); font-size:10px; cursor:pointer; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; margin-bottom:15px;">
                    <span>${t.sentiment}</span> <b id="v-${p.id}">${votes}</b>
                </button>
                <div style="height:55px; display:flex; align-items:center; justify-content:center; margin-bottom:10px;">
                    <img src="${p.logo}" style="max-height:50px; max-width:90%;" alt="${p.name}">
                </div>
                <h3 style="text-align:center; margin:0 0 15px 0; font-weight:900;">${p.name}</h3>
                <ul>
                    ${p.promises.map(pr => `
                        <li class="${pr.status}">
                            <span style="font-weight:bold; width:15px; display:inline-block;">${pr.status==='done'?'✓':(pr.status==='failed'?'✕':'•')}</span>
                            <a href="${pr.url}" target="_blank" style="text-decoration:none; color:inherit;">${pr.desc}</a>
                        </li>
                    `).join('')}
                </ul>
            `;
            app.appendChild(card);
        });
    } catch (e) { app.innerHTML = `<div style="grid-column:1/-1; text-align:center; color:red;">Błąd ładowania systemu. Sprawdź data.json</div>`; }
}

async function vote(id) {
    const { error } = await supabaseClient.rpc('increment_vote', { row_id: id });
    if (!error) {
        const el = document.getElementById(`v-${id}`);
        if (el) el.innerText = parseInt(el.innerText) + 1;
    }
}

document.addEventListener('DOMContentLoaded', init);
