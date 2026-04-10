const SB_URL = 'https://amixcppknszjfscnepnx.supabase.co';
const SB_KEY = 'sb_publishable_8pZgzv2BXthAUoBppO8U3A_edhabo2J';
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

let currentLang = 'pl';

const translations = {
    pl: {
        title: "terminal obywatelski",
        election: "WYBORY",
        last: "OSTATNIE:",
        next: "NADCHODZĄCE:",
        parl: "Parlamentarne",
        local: "Samorządowe",
        days: "dni",
        about: "za ok.",
        marketTitle: "RYNEK I WSKAŹNIKI",
        ratingTitle: "STATUSY RATINGOWE",
        aaa: "Realizacja (AAA)",
        bbb: "W procesie (BBB)",
        d: "Brak (D)",
        inflation: "Inflacja",
        gdp: "PKB",
        deficit: "Deficyt",
        execution: "wykonanie za rok 2025",
        sentiment: "SENTYMENT",
        audit: "Audyt i Sejm",
        init: "Inicjalizacja systemu..."
    },
    en: {
        title: "citizen terminal",
        election: "ELECTIONS",
        last: "LAST:",
        next: "UPCOMING:",
        parl: "General",
        local: "Local",
        days: "days",
        about: "in approx.",
        marketTitle: "MARKET & INDICATORS",
        ratingTitle: "RATING STATUS",
        aaa: "Completed (AAA)",
        bbb: "In progress (BBB)",
        d: "Failed (D)",
        inflation: "Inflation",
        gdp: "GDP",
        deficit: "Deficit",
        execution: "2025 execution",
        sentiment: "SENTIMENT",
        audit: "Audit & Parliament",
        init: "System initialization..."
    }
};

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('preferredLang', lang);
    updateUI();
    init(); // Ponowne wczytanie danych z nowymi etykietami
}

function updateUI() {
    const t = translations[currentLang];
    
    // Teksty statyczne w HTML
    document.title = t.title;
    document.querySelector('.main-header h1').innerText = t.title;
    document.getElementById('t-election-title').innerText = t.election;
    document.getElementById('t-last').innerText = t.last;
    document.getElementById('t-next').innerText = t.next;
    document.querySelectorAll('[id^="t-parl"]').forEach(el => el.innerText = t.parl);
    document.querySelectorAll('[id^="t-local"]').forEach(el => el.innerText = t.local);
    document.querySelectorAll('[id^="t-days"]').forEach(el => el.innerText = t.days);
    document.querySelectorAll('[id^="t-about"]').forEach(el => el.innerText = t.about);
    
    // Narożniki
    document.querySelector('.left-box .box-title').innerText = t.marketTitle;
    document.querySelector('.right-box .box-title').innerText = t.ratingTitle;
    
    const legend = document.querySelector('.right-box');
    legend.querySelectorAll('.legend-item')[0].innerHTML = `<span class="icon done">✓</span> ${t.aaa}`;
    legend.querySelectorAll('.legend-item')[1].innerHTML = `<span class="icon pending">•</span> ${t.bbb}`;
    legend.querySelectorAll('.legend-item')[2].innerHTML = `<span class="icon failed">✕</span> ${t.d}`;
}

async function init() {
    const app = document.getElementById('app');
    const ratesEl = document.getElementById('rates');
    const t = translations[currentLang];
    
    updateElectionCounters();

    try {
        const nbpRes = await fetch('https://api.nbp.pl/api/exchangerates/tables/A/?format=json').then(r => r.json());
        const eur = nbpRes[0].rates.find(x => x.code === 'EUR').mid;
        const usd = nbpRes[0].rates.find(x => x.code === 'USD').mid;
        
        if (ratesEl) {
            ratesEl.innerHTML = `
                <div style="border-bottom:1px dashed #e2e8f0; padding-bottom:6px; margin-bottom:6px; font-size:16px;">
                    EUR: <b>${eur}</b> | USD: <b>${usd}</b>
                </div>
                <div style="color:#475569; line-height:1.6;">
                    ${t.inflation}: <b>3.2%</b> | ${t.gdp}: <b>+2.8%</b><br>
                    ${t.deficit}: <b style="color:var(--amarant)">5.1% GDP</b> 
                    <span style="font-size:11px; color:#94a3b8;">(182bn PLN / ${t.execution})</span>
                </div>`;
        }

        const res = await fetch('data.json');
        const config = await res.json();
        const { data: voteData } = await supabaseClient.from('votes').select('*');

        if (app) {
            app.innerHTML = '';
            config.parties.forEach(p => {
                const votes = voteData?.find(v => v.party_id === p.id)?.count || 0;
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <button class="vote-btn" onclick="vote('${p.id}')">
                        <span>${t.sentiment}</span> <b id="v-${p.id}">${votes}</b>
                    </button>
                    <div style="height:55px; display:flex; align-items:center; justify-content:center; margin-bottom:10px;">
                        <img src="${p.logo}" style="max-height:50px; max-width:90%; object-fit:contain;" alt="${p.name}">
                    </div>
                    <h3 style="text-align:center; margin:0 0 15px 0; font-weight:900;">${p.name}</h3>
                    <ul style="list-style:none; padding:0; margin:0; flex-grow:1;">
                        ${p.promises.map(pr => `
                            <li class="${pr.status}">
                                <span style="font-weight:bold; width:15px; display:inline-block;">${pr.status==='done'?'✓':(pr.status==='failed'?'✕':'•')}</span>
                                <a href="${pr.url}" target="_blank" style="text-decoration:none; color:inherit;">${pr.desc}</a>
                            </li>
                        `).join('')}
                    </ul>
                    <div class="card-separator"></div>
                    <div class="bottom-analytics">
                        <div class="label">${t.audit}</div>
                        ${(p.critical_sources || []).map(src => `<a href="${src.url}" target="_blank" class="sub-link"><img src="${src.icon}" class="mini-icon"> <span>${src.text}</span></a>`).join('')}
                    </div>
                `;
                app.appendChild(card);
            });
        }
    } catch (err) { console.error(err); }
}

function updateElectionCounters() {
    const now = new Date();
    const getDiff = (d1, d2) => Math.floor(Math.abs(d1 - d2) / (1000 * 60 * 60 * 24));
    document.getElementById('days-since-parl').innerText = getDiff(now, new Date('2023-10-15'));
    document.getElementById('days-since-local').innerText = getDiff(now, new Date('2024-04-07'));
    document.getElementById('days-until-parl').innerText = getDiff(new Date('2027-10-17'), now);
    document.getElementById('days-until-local').innerText = getDiff(new Date('2029-04-08'), now);
}

// Inicjalizacja przy starcie
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferredLang');
    if (savedLang) currentLang = savedLang;
    updateUI();
    init();
});
