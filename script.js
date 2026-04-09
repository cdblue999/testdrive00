const SB_URL = 'https://amixcppknszjfscnepnx.supabase.co';
const SB_KEY = 'sb_publishable_8pZgzv2BXthAUoBppO8U3A_edhabo2J';
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

async function init() {
    const app = document.getElementById('app');
    const infoBar = document.getElementById('info-bar');

    try {
        // 1. Waluty
        const nbp = await fetch('https://api.nbp.pl/api/exchangerates/tables/A/?format=json').then(r => r.json());
        const eur = nbp[0].rates.find(x => x.code === 'EUR').mid;
        if (infoBar) infoBar.innerText = `Kurs EUR: ${eur} PLN | Wybory Parl.: 2027`;

        // 2. Dane
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
                        <img src="${p.logo}" class="logo" onclick="vote('${p.id}')">
                        <span class="vote-count">Głosy: <b id="v-${p.id}">${votes}</b></span>
                    </div>
                    <h3>${p.name}</h3>
                    <ul>
                        ${p.promises.map(pr => `<li class="${pr.status}">${pr.desc}</li>`).join('')}
                    </ul>
                `;
                app.appendChild(card);
            });
        }
    } catch (err) {
        console.error("Init error:", err);
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
