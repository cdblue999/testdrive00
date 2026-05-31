/*
 * Copyright (C) 2026 ZMS
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
const SB_URL = 'https://amixcppknszjfscnepnx.supabase.co';
const SB_KEY = 'sb_publishable_8pZgzv2BXthAUoBppO8U3A_edhabo2J';
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

let currentLang = localStorage.getItem('lang') || 'pl';

const translations = {
    pl: { mandates: "Mandaty", sentiment: "Popierasz?", critTitle: "ANALIZA KRYTYCZNA / KAPITAŁ PL", last: "OSTATNIE", next: "NADCHODZĄCE", days: "dni", news: " PILNE: Polska gospodarka przyspiesza • GUS potwierdza spadek inflacji • ", footer: "© 2026 terminal obywatelski. Dane: NBP, MF, SEJM.<br>Copyright by ZMS." },
    en: { mandates: "Mandates", sentiment: "SENTIMENT", critTitle: "CRITICAL ANALYSIS / PL CAPITAL", last: "LAST", next: "UPCOMING", days: "days", news: " BREAKING: Polish economy gains momentum • ", footer: "© 2026 citizen terminal. Data: NBP, MF, SEJM." },
    de: { mandates: "Mandate", sentiment: "STIMMUNG", critTitle: "KRITISCHE ANALYSE / PL KAPITAL", last: "LETZTE", next: "NÄCHSTE", days: "Tage", news: " EILMELDUNG: Wirtschaftswachstum stabil • ", footer: "© 2026 Bürgerterminal. Dane: NBP, MF, SEJM." }
};

const NEWS_RSS = 'https://news.google.com/rss/search?q=Polska&hl=pl&gl=PL&ceid=PL:pl';
const RSS2JSON = 'https://api.rss2json.com/v1/api.json';

const FUEL_API = 'https://www.e-petrol.pl/api/avgprices';

async function fetchFuelPrices() {
    const fallback = { pb95: '6,48', on: '6,22', lpg: '2,89' };
    try {
        const r = await fetch(FUEL_API, { signal: AbortSignal.timeout(4000) });
        const d = await r.json();
        if (d.pb95 && d.on && d.lpg) {
            return { pb95: String(d.pb95).replace('.', ','), on: String(d.on).replace('.', ','), lpg: String(d.lpg).replace('.', ',') };
        }
    } catch (_) {}
    return fallback;
}

async function fetchNews() {
    try {
        const r = await fetch(`${RSS2JSON}?rss_url=${encodeURIComponent(NEWS_RSS)}`);
        const d = await r.json();
        if (d.status === 'ok' && d.items?.length) {
            return d.items.slice(0, 10).map(i => i.title.replace(/\.\.\./g, '')).join(' • ') + ' • ';
        }
    } catch (_) {}
    return null;
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    init();
}

async function init() {
    const app = document.getElementById('app');
    const t = translations[currentLang] || translations['pl'];
    
    document.getElementById('t-footer').innerHTML = t.footer;

    const now = new Date();
    document.getElementById('current-date').innerText = now.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
    const getDiff = (d1, d2) => Math.floor(Math.abs(d1 - d2) / (1000 * 60 * 60 * 24));

    document.getElementById('legend-content').innerHTML = `
        <div class="data-block">
            <div><span style="color:#166534; font-weight:bold;">✓</span> Realizacja</div>
            <div><span style="color:#475569; font-weight:bold;">•</span> W procesie</div>
            <div><span style="color:#E52B50; font-weight:bold;">✕</span> Brak</div>
        </div>`;

    document.getElementById('election-data-box').innerHTML = `
        <div class="data-block">
            <div><strong>${t.last}:</strong> ${getDiff(now, new Date('2023-10-15'))} ${t.days}</div>
            <div><strong>${t.next}:</strong> ${getDiff(new Date('2027-10-17'), now)} ${t.days}</div>
        </div>`;

    try {
        const [nbpData, jsonData, voteRes, news, fuel] = await Promise.all([
            fetch('https://api.nbp.pl/api/exchangerates/tables/A/?format=json').then(r => r.json()),
            fetch('data.json').then(r => r.json()),
            supabaseClient.from('votes').select('*'),
            fetchNews(),
            fetchFuelPrices()
        ]);
        document.getElementById('ticker-content').innerText = (news || t.news) + (news || t.news);

        const eur = nbpData[0].rates.find(x => x.code === 'EUR').mid;
        const usd = nbpData[0].rates.find(x => x.code === 'USD').mid;
        
        document.getElementById('rates').innerHTML = `
            <div class="data-block">
                <div>EUR: <b>${eur}</b> | USD: <b>${usd}</b></div>
                <div>Inflacja: <b>3.2%</b> | PKB: <b>+2.8%</b></div>
                <div style="color:var(--amarant); font-weight:bold;">Deficyt: 5.1% GDP</div>
                <hr style="border:none;border-top:1px solid #e2e8f0;margin:8px 0;">
                <div style="font-size:10px;font-weight:800;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.3px;margin-bottom:4px;">Średnie ceny paliw /detal/</div>
                <div>Pb95: <b>${fuel.pb95}</b> zł | ON: <b>${fuel.on}</b> zł</div>
                <div>LPG: <b>${fuel.lpg}</b> zł</div>
            </div>`;

        app.innerHTML = '';
        jsonData.parties.forEach(p => {
            const votes = voteRes.data?.find(v => v.party_id === p.id)?.count || 0;
            const partyName = p[`name_${currentLang}`] || p.name_pl;
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div style="height:60px; display:flex; align-items:center; justify-content:center; margin-bottom:10px;">
                    <img src="${p.logo}" style="max-height:100%; max-width:100%; object-fit:contain;" onerror="this.style.display='none'" alt="">
                </div>
                <h3 style="text-align:center; margin:0 0 5px 0; font-weight:900;">${partyName}</h3>
                <div class="mandates-label">${t.mandates}: ${p.mandates}</div>
                <button class="vote-btn" onclick="vote('${p.id}')" style="display:flex; justify-content:space-between; align-items:center; width:100%; padding:6px 10px; font-family:var(--font-data); font-size:11px; cursor:pointer; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; margin-bottom:15px; transition:background 0.15s;" onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='#f8fafc'">
                    <span>${t.sentiment}</span> <b id="v-${p.id}">${votes}</b>
                </button>
                <ul style="list-style:none; padding:0; margin:0; flex-grow:1;">
                    ${p.promises.map(pr => `
                        <li class="${pr.status}" style="display:flex; align-items:center; gap:8px; padding:8px 0; border-bottom:1px solid #f1f5f9; line-height:1.4;">
                            <span style="font-weight:700; width:16px; flex-shrink:0; text-align:center;">${pr.status==='done'?'✓':(pr.status==='failed'?'✕':'•')}</span>
                            <a href="${pr.url}" target="_blank" style="text-decoration:none; color:inherit; flex-grow:1; font-size:12.5px;">${pr[`desc_${currentLang}`] || pr.desc_pl}</a>
                            ${pr.cost ? `<span class="cost-tag">${pr.cost}</span>` : ''}
                        </li>`).join('')}
                </ul>
                <div class="critical-section">
                    <div class="critical-title">${t.critTitle}</div>
                    ${p.critical_links ? p.critical_links.map(cl => `
                        <a href="${cl.url}" target="_blank" class="critical-link">→ ${cl[`label_${currentLang}`] || cl.label_pl}</a>
                    `).join('') : '<span style="font-size:11px; color:var(--text-muted);">Brak danych</span>'}
                </div>`;
            app.appendChild(card);
        });
    } catch (e) {
        document.getElementById('ticker-content').innerText = t.news + t.news;
        app.innerHTML = '<div style="text-align:center; padding:50px;">Błąd danych. Sprawdź plik data.json</div>';
    }
}

async function vote(id) {
    const { error } = await supabaseClient.rpc('increment_vote', { row_id: id });
    if (!error) {
        const el = document.getElementById(`v-${id}`);
        if (el) el.innerText = parseInt(el.innerText) + 1;
    }
}
document.addEventListener('DOMContentLoaded', init);
