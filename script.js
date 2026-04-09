const SB_URL = 'https://amixcppknszjfscnepnx.supabase.co';
const SB_KEY = 'sb_publishable_8pZgzv2BXthAUoBppO8U3A_edhabo2J';
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

// Funkcja obsługująca błąd lub zbyt długie ładowanie
function imgError(img) {
    const parent = img.parentNode;
    const errorSpan = document.createElement('span');
    errorSpan.className = 'img-error';
    errorSpan.innerText = '(chwilowy problem...)';
    parent.replaceChild(errorSpan, img);
}

function monitorImage(img) {
    // Jeśli nie załaduje się w 3 sekundy, uznaj to za błąd
    const timeout = setTimeout(() => {
        if (!img.complete || img.naturalWidth === 0) {
            imgError(img);
        }
    }, 3000);
    
    img.onload = () => clearTimeout(timeout);
    img.onerror = () => {
        clearTimeout(timeout);
        imgError(img);
    };
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
        const gus = { inflacja: "3.2%", pkb: "+2.8%", bezrobocie: "4.9%", pensja: "8 450 PLN", deficyt: "5.1% PKB" };

        if (ratesEl) {
            ratesEl.innerHTML = `
                <div style="border-bottom:1px dashed #eee; padding-bottom:3px; margin-bottom:3px;">
                    EUR: <b>${eur}</b> | USD: <b>${usd}</b>
                </div>
                <div style="color:#666; font-size:9.5px;">
                    Inflacja: <b>${gus.inflacja}</b> | PKB: <b>${gus.pkb}</b><br>
                    Bezrobocie: <b>${gus.bezrobocie}</b> | Śr. płaca: <b>${gus.pensja}</b><br>
                    Deficyt: <b style="color:var(--amarant)">${gus.deficyt}</b>
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

                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <button class="vote-btn" onclick="vote('${p.id}')">
                        <span>POPRZYJ PARTIĘ</span>
                        <b id="v-${p.id}">${votes}</b>
                    </button>

                    <a href="${p.website}" target="_blank" rel="noopener noreferrer" class="party-link">
                        <div class="party-header"><img src="${p.logo}" class="logo" alt="${p.name}"></div>
                        <h3>${p.name}</h3>
                    </a>

                    <div class="progress-container">
                        <div style="font-size: 8px; text-align:right; margin-bottom:2px;">Realizacja: ${percent}%</div>
                        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${percent}%"></div></div>
                    </div>

                    <ul>
                        ${p.promises.map(pr => {
                            let icon = pr.status === 'done' ? '✓' : (pr.status === 'failed' ? '✕' : '•');
                            return `<li class="${pr.status}"><span style="font-weight:bold;width:12px;display:inline-block">${icon}</span><a href="${pr.url}" target="_blank" rel="noopener noreferrer" style="text-decoration:none; color:inherit;">${pr.desc}</a></li>`;
                        }).join('')}
                    </ul>

                    <div class="bottom-info">
                        <div class="label">Weryfikacja i Krytyka</div>
                        ${p.critical_sources.map(src => `
                            <a href="${src.url}" target="_blank" rel="noopener noreferrer" class="sub-link">
                                <img src="${src.icon}" class="mini-icon" alt="icon"> <span>${src.text}</span>
                            </a>
                        `).join('')}
                    </div>

                    <div class="bottom-info" style="border-top:none; padding-top:0;">
                        <div class="label">Inicjatywa ustawodawcza</div>
                        ${p.legislative_initiatives.map(leg => `
                            <a href="${leg.url}" target="_blank" rel="noopener noreferrer" class="sub-link">
                                <div class="s-icon">S</div> <span>${leg.text}</span>
                            </a>
                        `).join('')}
                    </div>
                `;
                app.appendChild(card);
            });

            // Aktywacja monitorowania obrazów po ich dodaniu do DOM
            document.querySelectorAll('.logo, .mini-icon').forEach(monitorImage);
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
