// 1. Konfiguracja (wpisana tylko RAZ)
const SB_URL = 'https://amixcppknszjfscnepnx.supabase.co';
const SB_KEY = 'sb_publishable_8pZgzv2BXthAUoBppO8U3A_edhabo2J';

// Używamy nazwy supabaseClient, aby nie gryzła się z biblioteką
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

async function init() {
    const app = document.getElementById('app');
    console.log("Inicjalizacja licznika...");

    try {
        // Kursy walut z NBP
        try {
            const nbp = await fetch('https://api.nbp.pl/api/exchangerates/tables/A/?format=json').then(r => r.json());
            const eur = nbp[0].rates.find(x => x.code === 'EUR').mid;
            document.getElementById('info-bar').innerText = `EUR: ${eur} PLN | Wybory: 2027`;
        } catch (e) { console.warn("NBP niedostępne"); }

        // Pobieranie Twoich obietnic z pliku data.json
        const res = await fetch('data.json');
        if (!res.ok) throw new Error("Nie znaleziono pliku data.json");
        const config = await res.json();

        // Pobieranie głosów z Supabase
        const { data: voteData, error: dbError } = await supabaseClient.from('votes').select('*');
        if (dbError) console.error("Błąd bazy danych:", dbError);

        app.innerHTML = ''; // Czyścimy napis "Inicjalizacja..."

        config.parties.forEach(p => {
            const vCount = voteData?.find(v => v.party_id === p.id)?.count || 0;
            const card = document.createElement('div');
            card.className = 'party-col'; // upewnij się, że masz to w style.css
            card.innerHTML = `
                <div style="text-align:center;">
                    <img src="${p.logo}" style="height:40px; cursor:pointer;" onclick="vote('${p.id}')">
                    <div><small>Głosów: <b id="v-${p.id}">${vCount}</b></small></div>
                </div>
                <h3>${p.name}</h3>
                <ul style="list-style:none; padding:0;">
                    ${p.promises.map(pr => `<li class="${pr.status}" style="margin-bottom:5px;">• ${pr.desc}</li>`).join('')}
                </ul>
            `;
            app.appendChild(card);
        });

    } catch (err) {
        app.innerHTML = `<div style="color:red; padding:20px;">Błąd: ${err.message}</div>`;
        console.error(err);
    }
}

async function vote(id) {
    const { error } = await supabaseClient.rpc('increment_vote', { row_id: id });
    if (!error) {
        const el = document.getElementById(`v-${id}`);
        el.innerText = parseInt(el.innerText) + 1;
    }
}

// Startujemy!
init();
