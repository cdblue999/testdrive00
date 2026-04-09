const SB_URL = 'https://amixcppknszjfscnepnx.supabase.co';
const SB_KEY = 'sb_publishable_8pZgzv2BXthAUoBppO8U3A_edhabo2J';
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

async function init() {
    const app = document.getElementById('app');
    const infoBar = document.getElementById('info-bar');

    try {
        const nbp = await fetch('https://api.nbp.pl/api/exchangerates/tables/A/?format=json').then(r => r.json());
        const eur = nbp[0].rates.find(x => x.code === 'EUR').mid;
        if (infoBar) infoBar.innerHTML = `<a href="https://nbp.pl" target="_blank">Kurs EUR: ${eur} PLN</a> | Wybory: 2027`;

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
                        <img src="${p.logo}" class="logo" onclick="vote('${p.id}')" alt="Głosuj">
                        <span style="font-size:10px; color:#999; margin-top:5px;">POPARCIE: <b id="v-${p.id}">${votes}</b></span>
                    </div>
                    <h3>${p.name}</h3>
                    <div class="progress-container">
                        <div style="font-size: 9px; text-align:right;">Realizacja: ${percent}%</div>
                        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${percent}%"></div></div>
                    </div>
                    <ul>
                        ${p.promises.map(pr => {
                            let icon = pr.status === 'done' ? '✓' : (pr.status === 'failed' ? '✕' : '•');
                            return `<li class="${pr.status}"><span class="icon">${icon}</span><a href="${pr.url}" target="_blank" class="source-link">${pr.desc}</a></li>`;
                        }).join('')}
                    </ul>
                    
                    <hr>
                    <div class="critical-title">Weryfikacja i Krytyka</div>
                    <div class="critical-list">
                        ${p.critical_sources ? p.critical_sources.map(src => `
                            <a href="${src.url}" target="_blank" class="critical-link">
                                <img src="${src.icon}" class="mini-icon">
                                ${src.text}
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
