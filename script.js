const SB_URL = 'https://amixcppknszjfscnepnx.supabase.co';
const SB_KEY = 'sb_publishable_8pZgzv2BXthAUoBppO8U3A_edhabo2J';
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

function updateCounters() {
    try {
        const now = new Date();
        const getDiff = (d1, d2) => Math.floor(Math.abs(d1 - d2) / (1000 * 60 * 60 * 24));
        const ids = ['days-since-parl', 'days-since-local', 'days-until-parl', 'days-until-local'];
        const dates = [new Date('2023-10-15'), new Date('2024-04-07'), new Date('2027-10-17'), new Date('2029-04-08')];
        
        ids.forEach((id, i) => {
            const el = document.getElementById(id);
            if(el) el.innerText = getDiff(now, dates[i]);
        });
    } catch (e) { console.error("Licznik error", e); }
}

async function init() {
    const app = document.getElementById('app');
    const ratesEl = document.getElementById('rates');
    updateCounters();

    try {
        const nbpRes = await fetch('https://api.nbp.pl/api/exchangerates/tables/A/?format=json').then(r => r.json());
        const eur = nbpRes[0].rates.find(x => x.code === 'EUR').mid;
        const usd = nbpRes[0].rates.find(x => x.code === 'USD').mid;
        
        if (ratesEl) {
            ratesEl.innerHTML = `
                <div style="border-bottom:1px dashed #e2e8f0; padding-bottom:5px; margin-bottom:5px;">
                    EUR: <b>${eur}</b> | USD: <b>${usd}</b>
                </div>
                <div style="color:#475569;">
                    Inflacja: <b>3.2%</b> | PKB: <b>+2.8%</b><br>
                    Deficyt: <b style="color:var(--amarant)">5.1% PKB</b>
                </div>`;
        }

        const res = await fetch('data.json');
        if (!res.ok) throw new Error("JSON fail");
        const config = await res.json();

        if (app) {
            app.innerHTML = '';
            config.parties.forEach(p => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <div style="height:50px; display:flex; align-items:center; justify-content:center; margin-bottom:15px;">
                        <img src="${p.logo}" style="max-height:50px; max-width:90%;" alt="${p.name}">
                    </div>
                    <h3 style="text-align:center; margin:0 0 15px 0; font-weight:900;">${p.name}</h3>
                    <ul style="list-style:none; padding:0; margin:0;">
                        ${p.promises.map(pr => `
                            <li class="${pr.status}" style="padding:6px 0; font-size:12px; border-bottom:1px solid #f8fafc;">
                                <span style="font-weight:bold; width:15px; display:inline-block;">${pr.status==='done'?'✓':(pr.status==='failed'?'✕':'•')}</span>
                                <a href="${pr.url}" target="_blank" style="text-decoration:none; color:inherit;">${pr.desc}</a>
                            </li>
                        `).join('')}
                    </ul>
                `;
                app.appendChild(card);
            });
        }
    } catch (err) {
        if (app) app.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding:100px; color:var(--amarant); font-family:var(--font-data);">BŁĄD DANYCH: Sprawdź plik data.json</div>`;
    }
}

document.addEventListener('DOMContentLoaded', init);
