const SB_URL = 'https://amixcppknszjfscnepnx.supabase.co';
const SB_KEY = 'sb_publishable_8pZgzv2BXthAUoBppO8U3A_edhabo2J';
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

function updateElectionCounters() {
    const now = new Date();
    const getDiff = (d1, d2) => Math.floor(Math.abs(d1 - d2) / (1000 * 60 * 60 * 24));
    
    const elements = {
        'days-since-parl': new Date('2023-10-15'),
        'days-since-local': new Date('2024-04-07'),
        'days-until-parl': new Date('2027-10-17'),
        'days-until-local': new Date('2029-04-08')
    };

    for (const [id, date] of Object.entries(elements)) {
        const el = document.getElementById(id);
        if (el) el.innerText = getDiff(now, date);
    }
}

async function init() {
    const app = document.getElementById('app');
    const ratesEl = document.getElementById('rates');
    updateElectionCounters();

    try {
        // 1. Waluty i Makro (Wykonanie za rok 2025)
        const nbpRes = await fetch('https://api.nbp.pl/api/exchangerates/tables/A/?format=json').then(r => r.json());
        const eur = nbpRes[0].rates.find(x => x.code === 'EUR').mid;
        const usd = nbpRes[0].rates.find(x => x.code === 'USD').mid;
        const gus = { inflacja: "3.2%", pkb: "+2.8%", deficytPct: "5.1%", deficytKwota: "182 mld PLN" };

        if (ratesEl) {
            ratesEl.innerHTML = `
                <div style="border-bottom:1px dashed #e2e8f0; padding-bottom:6px; margin-bottom:6px; font-size:16px;">
                    EUR: <b>${eur}</b> | USD: <b>${usd}</b>
                </div>
                <div style="color:#475569; line-height:1.6;">
                    Inflacja: <b>${gus.inflacja}</b> | PKB: <b>${gus.pkb}</b><br>
                    Deficyt: <b style="color:var(--amarant)">${gus.deficytPct} PKB</b> 
                    <span style="font-size:11px; color:#94a3b8; letter-spacing:0;">
                        (${gus.deficytKwota} / wykonanie 2025)
                    </span>
                </div>`;
        }

        // 2. Ładowanie danych głównych (try-catch master)
        const res = await fetch('data.json');
        if (!res.ok) throw new Error("JSON Fetch Failed");
        const config = await res.json();
        
        // Supabase Vote Data (try-catch master)
        let voteData = [];
        try {
            const { data } = await supabaseClient.from('votes').select('*');
            voteData = data || [];
        } catch(e) { console.warn("Vote data connect skipped"); }

        if (app) {
            app.innerHTML = ''; // Czyścimy status
            config.parties.forEach(p => {
                const votes = voteData.find(v => v.party_id === p.id)?.count || 0;
                const total = p.promises.length;
                const done = p.promises.filter(pr => pr.status === 'done').length;
                const percent = Math.round((done / total) * 100) || 0;
                const rating = percent > 75 ? 'AAA' : (percent > 40 ? 'BBB' : 'B-');

                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <button class="vote-btn" onclick="vote('${p.id}')">
                        <span>SENTYMENT OBYWATELSKI</span> <b id="v-${p.id}">${votes}</b>
                    </button>

                    <a href="${p.website}" target="_blank" rel="noopener noreferrer" class="party-link">
                        <div style="height:55px; display:flex; align-items:center; justify-content:center; margin-bottom:10px;">
                            <img src="${p.logo}" class="logo" alt="${p.name}">
                        </div>
                        <h3>${p.name} <span style="font-size:10px; color:#94a3b8; font-weight:400;">[${rating}]</span></h3>
                    </a>

                    <div style="margin-bottom:15px; flex-shrink: 0;">
                        <div style="font-size:9px; font-weight:700; font-family:var(--font-data); margin-bottom:4px;">PROGRES: ${percent}%</div>
                        <div style="background:#f1f5f9; height:6px; border-radius:10px; overflow:hidden;">
                            <div style="background:var(--success-green); height:100%; width:${percent}%"></div>
                        </div>
                    </div>

                    <ul>
                        ${p.promises.map(pr => `
                            <li class="${pr.status}">
                                <span>${pr.status === 'done' ? '✓' : (pr.status === 'failed' ? '✕' : '•')}</span>
                                <a href="${pr.url}" target="_blank" rel="noopener noreferrer">${pr.desc}</a>
                            </li>
                        `).join('')}
                    </ul>

                    <div class="card-separator"></div>

                    <div class="bottom-analytics">
                        <div class="analytics-section">
                            <div class="label">Audyt i Krytyka Merytoryczna</div>
                            ${(p.critical_sources || []).map(src => `
                                <a href="${src.url}" target="_blank" class="sub-link">
                                    <img src="${src.icon}" class="mini-icon" onerror="this.src='https://placehold.co/14?text=i'">
                                    <span>${src.text}</span>
                                </a>
                            `).join('')}
                        </div>

                        <div class="analytics-section">
                            <div class="label">Inicjatywa Sejmowa (X)</div>
                            ${(p.legislative_initiatives || []).map(leg => `
                                <a href="${leg.url}" target="_blank" class="sub-link">
                                    <div class="s-icon">S</div>
                                    <span>${leg.text}</span>
                                </a>
                            `).join('')}
                        </div>
                    </div>
                `;
                app.appendChild(card);
            });
        }
    } catch (err) {
        console.error(err);
        if (app) app.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:100px; color:var(--amarant); font-family:var(--font-data);">BŁĄD KRYTYCZNY DANYCH: Sprawdź plik data.json</div>`;
    }
}

async function vote(id) {
    try {
        const { error } = await supabaseClient.rpc('increment_vote', { row_id: id });
        if (!error) {
            const el = document.getElementById(`v-${id}`);
            if (el) el.innerText = parseInt(el.innerText) + 1;
        }
    } catch(e) { console.error("Vote failed connect skipped"); }
}

document.addEventListener('DOMContentLoaded', init);
