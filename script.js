const SB_URL = 'https://amixcppknszjfscnepnx.supabase.co';
const SB_KEY = 'sb_publishable_8pZgzv2BXthAUoBppO8U3A_edhabo2J';
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

function updateElectionCounters() {
    const now = new Date();
    const parlPast = new Date('2023-10-15'); const localPast = new Date('2024-04-07');
    const parlFuture = new Date('2027-10-17'); const localFuture = new Date('2029-04-08');
    const getDiff = (d1, d2) => Math.floor(Math.abs(d1 - d2) / (1000 * 60 * 60 * 24));
    document.getElementById('days-since-parl').innerText = getDiff(now, parlPast);
    document.getElementById('days-since-local').innerText = getDiff(now, localPast);
    document.getElementById('days-until-parl').innerText = getDiff(parlFuture, now);
    document.getElementById('days-until-local').innerText = getDiff(localFuture, now);
}

// NOWA FUNKCJA: WYKRES HISTORYCZNY
function initHistoryChart() {
    const ctx = document.getElementById('supportChart').getContext('2d');
    
    // Dane przykładowe (trend poparcia w twoim liczniku)
    const labels = ['Listopad', 'Grudzień', 'Styczeń', 'Luty', 'Marzec', 'Kwiecień'];
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                { label: 'KO', data: [31, 32, 30, 33, 31, 34], borderColor: '#0052cc', tension: 0.3, fill: false },
                { label: 'PiS', data: [29, 28, 30, 27, 28, 26], borderColor: '#E52B50', tension: 0.3, fill: false },
                { label: '3D', data: [14, 13, 15, 12, 11, 12], borderColor: '#1e8449', tension: 0.3, fill: false },
                { label: 'Konf', data: [10, 11, 9, 12, 13, 14], borderColor: '#1a1a1a', tension: 0.3, fill: false },
                { label: 'Lewica', data: [8, 9, 8, 7, 9, 8], borderColor: '#d63031', tension: 0.3, fill: false }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 10 } } } },
            scales: {
                y: { beginAtZero: false, grid: { color: '#f0f0f0' }, ticks: { font: { size: 9 } } },
                x: { grid: { display: false }, ticks: { font: { size: 9 } } }
            }
        }
    });
}

async function init() {
    const app = document.getElementById('app');
    const ratesEl = document.getElementById('rates');
    updateElectionCounters();
    initHistoryChart(); // Uruchomienie wykresu

    try {
        const nbpRes = await fetch('https://api.nbp.pl/api/exchangerates/tables/A/?format=json').then(r => r.json());
        const eur = nbpRes[0].rates.find(x => x.code === 'EUR').mid;
        const usd = nbpRes[0].rates.find(x => x.code === 'USD').mid;
        const gus = { inflacja: "3.2%", pkb: "+2.8%", bezrobocie: "4.9%", pensja: "8 450 PLN" };

        if (ratesEl) {
            ratesEl.innerHTML = `
                <div style="border-bottom: 1px dashed #eee; padding-bottom:3px; margin-bottom:3px;">
                    EUR: <b style="color:#111">${eur}</b> | USD: <b style="color:#111">${usd}</b>
                </div>
                <div style="color: #666; font-size: 9.5px;">
                    Inflacja: <b>${gus.inflacja}</b> | PKB: <b>${gus.pkb}</b><br>
                    Bezrobocie: <b>${gus.bezrobocie}</b> | Pensja: <b>${gus.pensja}</b>
                </div>
            `;
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

                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <div class="party-header">
                        <img src="${p.logo}" class="logo" crossorigin="anonymous" onclick="vote('${p.id}')">
                        <span style="font-size:9px; color:#aaa; margin-top:3px;">POPARCIE: <b id="v-${p.id}">${votes}</b></span>
                    </div>
                    <h3>${p.name}</h3>
                    <div class="progress-container">
                        <div style="font-size: 8px; text-align:right;">Realizacja: ${percent}%</div>
                        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${percent}%"></div></div>
                    </div>
                    <ul>
                        ${p.promises.map(pr => {
                            let icon = pr.status === 'done' ? '✓' : (pr.status === 'failed' ? '✕' : '•');
                            return `<li class="${pr.status}"><span style="font-weight:bold;width:12px;display:inline-block">${icon}</span><a href="${pr.url}" target="_blank" rel="noopener noreferrer" class="source-link">${pr.desc}</a></li>`;
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
    } catch (err) { console.error(err); }
}

async function vote(id) {
    const { error } = await supabaseClient.rpc('increment_vote', { row_id: id });
    if (!error) {
        const el = document.getElementById(`v-${id}`);
        if (el) el.innerText = parseInt(el.innerText) + 1;
    }
}

init();
