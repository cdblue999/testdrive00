const SB_URL = 'https://amixcppknszjfscnepnx.supabase.co';
const SB_KEY = 'sb_publishable_8pZgzv2BXthAUoBppO8U3A_edhabo2J';
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

async function init() {
    const app = document.getElementById('app');
    const infoBar = document.getElementById('info-bar');

    try {
        // 1. Kursy walut z aktywnym linkiem do NBP
        const nbpRes = await fetch('https://api.nbp.pl/api/exchangerates/tables/A/?format=json').then(r => r.json());
        const eur = nbpRes[0].rates.find(x => x.code === 'EUR').mid;
        const usd = nbpRes[0].rates.find(x => x.code === 'USD').mid;
        
        if (infoBar) {
            infoBar.innerHTML = `
                <a href="https://nbp.pl/statystyka-i-sprawozdawczosc/kursy/tabela-a/" target="_blank">
                    EUR: ${eur} PLN | USD: ${usd} PLN
                </a> 
                | Cel inflacyjny: 2.5% | Wybory: 2027`;
        }

        // 2. Pobieranie danych
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
                    <div class="party-header">
                        <img src="${p.logo}" class="logo" onclick="vote('${p.id}')" title="Oddaj głos">
                        <span style="font-size:10px; color:#999; margin-top:5px;">Głosy: <b id="v-${p.id}">${votes}</b></span>
                    </div>
                    <h3>${p.name}</h3>
                    <ul>
                        ${p.promises.map(pr => {
                            let icon = pr.status === 'done' ? '✓' : (pr.status === 'failed' ? '✕' : '•');
                            return `
                                <li class="${pr.status}">
                                    <span class="icon">${icon}</span>
                                    <a href="${pr.url}" target="_blank" class="source-link" title="Zobacz źródło informacji">
                                        ${pr.desc}
                                    </a>
                                </li>`;
                        }).join('')}
                    </ul>
                `;
                app.appendChild(card);
            });
        }
    } catch (err) {
        console.error("Błąd ładowania:", err);
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
