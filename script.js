const SB_URL = 'https://licznikpartyjny.netlify.app/';
const SB_KEY = 'amixcppknszjfscnepnx';
const supabase = supabase.createClient(SB_URL, SB_KEY);

async function init() {
    // Kursy NBP
    const nbp = await fetch('https://api.nbp.pl/api/exchangerates/tables/A/?format=json').then(r => r.json());
    document.getElementById('info-bar').innerText = `EUR: ${nbp[0].rates.find(x => x.code === 'EUR').mid} PLN`;

    // Dane i Głosy
    const { parties } = await fetch('data.json').then(r => r.json());
    const { data: voteData } = await supabase.from('votes').select('*');

    const app = document.getElementById('app');
    parties.forEach(p => {
        const vCount = voteData.find(v => v.party_id === p.id)?.count || 0;
        const col = document.createElement('div');
        col.className = 'card';
        col.innerHTML = `
            <img src="${p.logo}" class="logo" onclick="vote('${p.id}')">
            <center><small>Głosów: <b id="v-${p.id}">${vCount}</b></small></center>
            <h3>${p.name}</h3>
            <ul>${p.promises.map(pr => `<li class="${pr.status}">${pr.txt}</li>`).join('')}</ul>
        `;
        app.appendChild(col);
    });
}

async function vote(id) {
    await supabase.rpc('increment_vote', { row_id: id });
    const el = document.getElementById(`v-${id}`);
    el.innerText = parseInt(el.innerText) + 1;
}

init();
