const SB_URL = 'https://amixcppknszjfscnepnx.supabase.co';
const SB_KEY = 'sb_publishable_8pZgzv2BXthAUoBppO8U3A_edhabo2J';
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

function updateCounters() {
    try {
        const now = new Date();
        const getDiff = (d1, d2) => Math.floor(Math.abs(d1 - d2) / (1000 * 60 * 60 * 24));
        document.getElementById('days-since-parl').innerText = getDiff(now, new Date('2023-10-15'));
        document.getElementById('days-since-local').innerText = getDiff(now, new Date('2024-04-07'));
        document.getElementById('days-until-parl').innerText = getDiff(new Date('2027-10-17'), now);
        document.getElementById('days-until-local').innerText = getDiff(new Date('2029-04-08'), now);
    } catch (e) { console.error("Counter Error", e); }
}

async function init() {
    const app = document.getElementById('app');
    const ratesEl = document.getElementById('rates');
    updateCounters();

    // MODUŁ 1: WALUTY I PKB
    try {
        const nbpRes = await fetch('https://api.nbp.pl/api/exchangerates/tables/A/?format=json').then(r => r.json());
        const eur = nbpRes[0].rates.find(x => x.code === 'EUR').mid;
        const usd = nbpRes[0].rates.find(x => x.code === 'USD').mid;
        const gus = { inflacja: "3.2%", pkb: "+2.8%", deficyt: "5.1%", kwota: "182 mld" };

        if (ratesEl) {
            ratesEl.innerHTML = `
                <div style="border-bottom:1px dashed #e2e8f0; padding-bottom:6px; margin-bottom:6px; font-size:16px;">
                    EUR: <b>${eur}</b> | USD: <b>${usd}</b>
                </div>
                <div style="color:#475569; line-height:1.5;">
                    Inflacja: <b>${gus.inflacja}</b> | PKB: <b>${gus.pkb}</b><br>
                    Deficyt: <b style="color:var(--amarant)">${gus.deficyt} PKB</b><br>
                    <span style="font-size:11px; color:#94a3b8;">/ ${gus.kwota} PLN (2025)</span>
                </div>`;
        }
    } catch (e) { if (ratesEl) ratesEl.innerText = "Błąd NBP/GUS"; }

    // MODUŁ 2: DANE PARTII
    try {
        const res = await fetch('data.json');
        if (!res.ok) throw new Error("Problem z data.json");
        const config = await res.json();
        const { data: voteData } = await supabaseClient.from('votes').select('*');

        if (app) {
            app.innerHTML = '';
            config.parties.forEach(p => {
                const votes = voteData?.find(v => v.party_id === p.id)?.count || 0;
                const total = p.promises.length;
                const done = p.promises.filter(pr => pr.status === 'done').length;
                const percent = Math.round((done / total) * 100) || 0;

                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <button class="vote-btn" onclick="vote('${p.id}')">
                        <span>SENTYMENT</span> <b id="v-${p.id}">${votes}</b>
                    </button>
                    <a href="${p.website}" target="_blank" rel="noopener noreferrer" style="text-decoration:none; color:inherit;">
                        <div style="height:55px; display:flex; align-items:center; justify-content:center; margin-bottom:10px;">
                            <img src="${p.logo}" style="max-height:50px; max-width:90%; object-fit:contain;" alt="${p.name}">
                        </div>
                        <h3 style="font-size:1.15em; text-align:center; margin:10px 0; font-weight:800; border-bottom:1px solid #f1f5f9; padding-bottom:8px;">
                            ${p.name}
                        </h3>
                    </a>
                    <div style="margin-bottom:15px;">
                        <div style="font-size:9px; font-weight:700; font-family:var(--font-data); margin-bottom:4px;">PROGRES: ${percent}%</div>
                        <div style="background:#f1f5f9; height:6px; border-radius:10px; overflow:hidden;">
                            <div style="background:var(--success-green); height:100%; width:${percent}%"></div>
                        </div>
                    </div>
                    <ul style="list-style:none; padding:0; margin:0; flex-grow:1;">
                        ${p.promises.map(pr => `
                            <li class="${pr.status}" style="padding:6px 0; font-size:12px; border-bottom:1px solid #f8fafc;">
                                <span style="font-weight:bold; width:15px; display:inline-block;">${pr.status==='done'?'✓':(pr.status==='failed'?'✕':'•')}</span>
                                <a href="${pr.url}" target="_blank" rel="noopener noreferrer" style="text-decoration:none; color:inherit;">${pr.desc}</a>
                            </li>
                        `).join('')}
                    </ul>
                    <div style="height:1px; background:linear-gradient(to right, transparent, #e2e8f0, transparent); margin:15px 0;"></div>
                    <div style="font-size:8px; font-weight:800; color:#94a3b8; text-transform:uppercase; margin-bottom:10px;">Audyt i Sejm</div>
                    ${(p.critical_sources || []).slice(0,2).map(src => `<a href="${src.url}" target="_blank" style="display:flex; align-items:center; gap:8px; text-decoration:none; color:#475569; font-size:10px; margin-bottom:5px;"><img src="${src.icon}" style="width:14px; height:14px; object-fit:contain;"> <span>${src.text}</span></a>`).join('')}
                `;
                app.appendChild(card);
            });
        }
    } catch (err) {
        if (app) app.innerHTML = `<div class="status-msg" style="color:var(--amarant)">BŁĄD KRYTYCZNY: ${err.message}. Sprawdź plik data.json.</div>`;
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
