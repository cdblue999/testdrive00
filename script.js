const SB_URL = 'https://amixcppknszjfscnepnx.supabase.co';
const SB_KEY = 'sb_publishable_8pZgzv2BXthAUoBppO8U3A_edhabo2J';
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

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
        
        const gus = { inflacja: "3.2%", pkb: "+2.8%", deficyt: "5.1%", kwota: "182 mld" };

        if (ratesEl) {
            ratesEl.innerHTML = `
                <div style="border-bottom:1px dashed #e2e8f0; padding-bottom:5px; margin-bottom:5px;">
                    EUR: <b>${eur}</b> | USD: <b>${usd}</b>
                </div>
                <div style="color:#64748b; font-size:9px; line-height:1.5;">
                    Inflacja: <b>${gus.inflacja}</b> | PKB: <b>${gus.pkb}</b><br>
                    Deficyt: <b style="color:var(--amarant)">${gus.deficyt} PKB</b><br>
                    <span style="font-size:8px; color:#94a3b8;">Skala długu: ${gus.kwota} PLN (2025)</span>
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
                
                // Rating Agency Logic
                const rating = percent > 75 ? 'AAA' : (percent > 40 ? 'BBB' : 'B-');
                const outlook = percent > 50 ? 'Stable' : 'Negative';
                const trendIcon = percent > 50 ? '↑' : '↓';

                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <button class="vote-btn" onclick="vote('${p.id}')">
                        <span>SENTYMENT OBYWATELSKI</span>
                        <b id="v-${p.id}">${votes}</b>
                    </button>

                    <a href="${p.website}" target="_blank" rel="noopener noreferrer" class="party-link">
                        <div class="party-header">
                            <img src="${p.logo}" class="logo" alt="${p.name}" loading="lazy">
                        </div>
                        <h3>${p.name} <span style="font-size:11px; color:#94a3b8; font-weight:400;">[${rating}]</span></h3>
                    </a>

                    <div class="progress-container">
                        <div style="font-size: 8.5px; display:flex; justify-content:space-between; font-weight:700;">
                            <span>PROGRES: ${percent}%</span>
                            <span style="color:var(--amarant)">OUTLOOK: ${outlook} ${trendIcon}</span>
                        </div>
                        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${percent}%"></div></div>
                    </div>

                    <ul>
                        ${p.promises.map(pr => {
                            let icon = pr.status === 'done' ? '✓' : (pr.status === 'failed' ? '✕' : '•');
                            return `<li class="${pr.status}"><span style="font-weight:bold;width:15px;display:inline-block">${icon}</span><a href="${pr.url}" target="_blank" rel="noopener noreferrer" class="source-link">${pr.desc}</a></li>`;
                        }).join('')}
                    </ul>

                    <div class="bottom-info">
                        <div class="label">AUDYT I KRYTYKA RYNKOWA</div>
                        ${p.critical_sources.map(src => `
                            <a href="${src.url}" target="_blank" rel="noopener noreferrer" class="sub-link">
                                <img src="${src.icon}" class="mini-icon" onerror="this.src='https://placehold.co/20?text=i'">
                                <span>${src.text}</span>
                            </a>
                        `).join('')}
                    </div>

                    <div class="bottom-info" style="border-top:none; padding-top:0;">
                        <div class="label">PROCES LEGISLACYJNY (SEJM X)</div>
                        ${p.legislative_initiatives.map(leg => `
                            <a href="${leg.url}" target="_blank" rel="noopener noreferrer" class="sub-link">
                                <div class="s-icon">S</div>
                                <span>${leg.text}</span>
                            </a>
                        `).join('')}
                    </div>
                `;
                app.appendChild(card);
            });
        }
    } catch (err) { console.error("System Error:", err); }
}

async function vote(id) {
    const { error } = await supabaseClient.rpc('increment_vote', { row_id: id });
    if (!error) {
        const el = document.getElementById(`v-${id}`);
        if (el) el.innerText = parseInt(el.innerText) + 1;
    }
}

init();
