const SB_URL = 'https://amixcppknszjfscnepnx.supabase.co';
const SB_KEY = 'sb_publishable_8pZgzv2BXthAUoBppO8U3A_edhabo2J';
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

// Funkcja zabezpieczająca przed XSS (Sanitization)
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function updateElectionCounters() {
    const now = new Date();
    const getDiff = (d1, d2) => Math.floor(Math.abs(d1 - d2) / (1000 * 60 * 60 * 24));
    document.getElementById('days-since-parl').innerText = getDiff(now, new Date('2023-10-15'));
    document.getElementById('days-since-local').innerText = getDiff(now, new Date('2024-04-07'));
    document.getElementById('days-until-parl').innerText = getDiff(new Date('2027-10-17'), now);
    document.getElementById('days-until-local').innerText = getDiff(new Date('2029-04-08'), now);
}

async function init() {
    const app = document.getElementById('app');
    const ratesEl = document.getElementById('rates');
    updateElectionCounters();

    try {
        const nbpRes = await fetch('https://api.nbp.pl/api/exchangerates/tables/A/?format=json').then(r => r.json());
        const eur = nbpRes[0].rates.find(x => x.code === 'EUR').mid;
        const usd = nbpRes[0].rates.find(x => x.code === 'USD').mid;
        
        // Dane makro (GUS/MF 2026)
        const gus = { inflacja: "3.2%", pkb: "+2.8%", deficyt: "5.1%", kwota: "182 mld" };

        if (ratesEl) {
            ratesEl.innerHTML = `
                <div style="border-bottom:1px dashed #eee; padding-bottom:3px; margin-bottom:3px;">
                    EUR: <b>${eur}</b> | USD: <b>${usd}</b>
                </div>
                <div style="color:#666; font-size:9px;">
                    Inflacja: <b>${gus.inflacja}</b> | PKB: <b>${gus.pkb}</b> | Deficyt: <b style="color:var(--amarant)">${gus.deficyt}</b><br>
                    <span style="font-size:8px; color:#999;">Skala długu: ${gus.kwota} PLN (2025)</span>
                </div>`;
        }

        const res = await fetch('data.json');
        const config = await res.json();
        const { data: voteData } = await supabaseClient.from('votes').select('*');

        if (app) {
            app.innerHTML = '';
            config.parties.forEach(p => {
                const votes = voteData?.find(v => v.party_id === p.id)?.count || 0;
                const total = p.promises.length;
                const done = p.promises.filter(pr => pr.status === 'done').length;
                const percent = total > 0 ? Math.round((done / total) * 100) : 0;
                
                // Rating Agency Style: Outlook (Przykładowy logiczny trend)
                const outlook = percent > 50 ? '↑' : (percent < 20 ? '↓' : '→');
                const rating = percent > 80 ? 'AAA' : (percent > 40 ? 'BBB' : 'C');

                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <button class="vote-btn" onclick="vote('${p.id}')">
                        <span>SENTYMENT RYNKOWY</span>
                        <b id="v-${p.id}">${votes}</b>
                    </button>

                    <a href="${p.website}" target="_blank" rel="noopener noreferrer" class="party-link">
                        <div class="party-header"><img src="${p.logo}" class="logo" alt="${p.name}" onerror="this.src='https://placehold.co/50?text=Logo'"></div>
                        <h3>${escapeHTML(p.name)} <span style="font-size:10px; color:#999">[${rating}]</span></h3>
                    </a>

                    <div class="progress-container">
                        <div style="font-size: 8px; display:flex; justify-content:space-between;">
                            <span>Realizacja: ${percent}%</span>
                            <span style="font-weight:bold; color:var(--amarant)">Outlook: ${outlook}</span>
                        </div>
                        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${percent}%"></div></div>
                    </div>

                    <ul>
                        ${p.promises.map(pr => {
                            let icon = pr.status === 'done' ? '✓' : (pr.status === 'failed' ? '✕' : '•');
                            return `<li class="${pr.status}"><span style="font-weight:bold;width:12px;display:inline-block">${icon}</span><a href="${pr.url}" target="_blank" rel="noopener noreferrer" style="text-decoration:none; color:inherit;">${escapeHTML(pr.desc)}</a></li>`;
                        }).join('')}
                    </ul>

                    <div class="bottom-info">
                        <div class="label">Audyt i Weryfikacja (3rd Party)</div>
                        ${p.critical_sources.slice(0, 3).map(src => `
                            <a href="${src.url}" target="_blank" rel="noopener noreferrer" class="sub-link">
                                <img src="${src.icon}" class="mini-icon" onerror="this.src='https://placehold.co/14?text=i'"> <span>${escapeHTML(src.text)}</span>
                            </a>
                        `).join('')}
                    </div>

                    <div class="bottom-info" style="border-top:none; padding-top:0;">
                        <div class="label">Działania Sejmowe (X Kadencja)</div>
                        ${p.legislative_initiatives.slice(0, 2).map(leg => `
                            <a href="${leg.url}" target="_blank" rel="noopener noreferrer" class="sub-link">
                                <div class="s-icon">S</div> <span>${escapeHTML(leg.text)}</span>
                            </a>
                        `).join('')}
                    </div>
                `;
                app.appendChild(card);
            });
        }
    } catch (err) { console.error("Critical Security/Load Error:", err); }
}

async function vote(id) {
    const { error } = await supabaseClient.rpc('increment_vote', { row_id: id });
    if (!error) {
        const el = document.getElementById(`v-${id}`);
        if (el) el.innerText = parseInt(el.innerText) + 1;
    }
}

init();
