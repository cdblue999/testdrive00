const SB_URL = 'https://amixcppknszjfscnepnx.supabase.co';
const SB_KEY = 'sb_publishable_8pZgzv2BXthAUoBppO8U3A_edhabo2J';
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

function updateElectionCounters() {
    const now = new Date();
    const parlPast = new Date('2023-10-15');
    const localPast = new Date('2024-04-07');
    const parlFuture = new Date('2027-10-17'); 
    const localFuture = new Date('2029-04-08');

    const getDiff = (d1, d2) => Math.floor(Math.abs(d1 - d2) / (1000 * 60 * 60 * 24));

    document.getElementById('days-since-parl').innerText = getDiff(now, parlPast);
    document.getElementById('days-since-local').innerText = getDiff(now, localPast);
    document.getElementById('days-until-parl').innerText = getDiff(parlFuture, now);
    document.getElementById('days-until-local').innerText = getDiff(localFuture, now);
}

async function init() {
    const app = document.getElementById('app');
    const ratesEl = document.getElementById('rates');

    updateElectionCounters();

    try {
        // 1. Waluty NBP
        const nbpRes = await fetch('https://api.nbp.pl/api/exchangerates/tables/A/?format=json').then(r => r.json());
        const eur = nbpRes[0].rates.find(x => x.code === 'EUR').mid;
        const usd = nbpRes[0].rates.find(x => x.code === 'USD').mid;

        // 2. Wskaźniki GUS (Dane na kwiecień 2026)
        const gus = {
            inflacja: "3.2%", // CPI r/r
            pkb: "+2.8%",     // Dynamika realna
            bezrobocie: "4.9%", // Stopa rejestrowana
            pensja: "8 450 PLN" // Przeciętne wynagrodzenie
        };

        if (ratesEl) {
            ratesEl.innerHTML = `
                <div style="margin-bottom: 5px;">
                    <a href="https://nbp.pl" target="_blank" rel="noopener noreferrer">EUR: <b>${eur}</b></a><br>
                    <a href="https://nbp.pl" target="_blank" rel="noopener noreferrer">USD: <b>${usd}</b></a>
                </div>
                
                <div style="margin-top: 10px; padding-top: 5px; border-top: 1px dashed #eee;">
                    <a href="https://stat.gov.pl" target="_blank" rel="noopener noreferrer" style="font-size: 9px; color: #999; display: block; margin-bottom: 4px;">WSKAŹNIKI GUS:</a>
                    Inflacja (CPI): <b>${gus.inflacja}</b><br>
                    Wzrost PKB: <b>${gus.pkb}</b><br>
                    Bezrobocie: <b>${gus.bezrobocie}</b><br>
                    Śr. pensja: <b>${gus.pensja}</b>
                </div>
            `;
        }

        // 3. Dane aplikacji
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

                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <div class="party-header">
                        <img src="${p.logo}" class="logo" crossorigin="anonymous" onclick="vote('${p.id}')">
                        <span style="font-size:10px; color:#aaa; margin-top:5px;">POPARCIE: <b id="v-${p.id}">${votes}</b></span>
                    </div>
                    <h3>${p.name}</h3>
                    <div class="progress-container">
                        <div style="font-size: 9px; text-align:right; margin-bottom:2px;">Realizacja: ${percent}%</div>
                        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${percent}%"></div></div>
                    </div>
                    <ul>
                        ${p.promises.map(pr => {
                            let icon = pr.status === 'done' ? '✓' : (pr.status === 'failed' ? '✕' : '•');
                            return `<li class="${pr.status}"><span class="icon">${icon}</span><a href="${pr.url}" target="_blank" rel="noopener noreferrer" class="source-link">${pr.desc}</a></li>`;
                        }).join('')}
                    </ul>
                    <hr>
                    <div class="critical-title">Weryfikacja</div>
                    <div class="critical-list">
                        ${p.critical_sources ? p.critical_sources.map(src => `
                            <a href="${src.url}" target="_blank" rel="noopener noreferrer" class="critical-link">
                                <img src="${src.icon}" class="mini-icon"> ${src.text}
                            </a>
                        `).join('') : ''}
                    </div>
                `;
                app.appendChild(card);
            });
        }
    } catch (err) {
        console.error("System error:", err);
    }
}

async function vote(id) {
    const { error } = await supabaseClient.rpc('increment_vote', { row_id: id });
    if (!error) {
        const el = document.getElementById(`v-${id}`);
        if (el) el.innerText = parseInt(el.innerText) + 1;
    }
}

init();
