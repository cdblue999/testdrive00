// Konfiguracja - tylko RAZ w całym projekcie
const SB_URL = 'https://amixcppknszjfscnepnx.supabase.co';
const SB_KEY = 'sb_publishable_8pZgzv2BXthAUoBppO8U3A_edhabo2J';

// Inicjalizacja klienta (zmienna o unikalnej nazwie)
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

async function init() {
    const app = document.getElementById('app');
    const infoBar = document.getElementById('info-bar');

    // 1. Kursy walut z NBP
    try {
        const nbp = await fetch('https://api.nbp.pl/api/exchangerates/tables/A/?format=json').then(r => r.json());
        const eur = nbp[0].rates.find(x => x.code === 'EUR').mid;
        if (infoBar) infoBar.innerText = `EUR: ${eur} PLN | Wybory: 2027`;
    } catch (e) {
        console.warn("Nie udało się pobrać kursów walut.");
    }

    // 2. Ładowanie danych i renderowanie
    try {
        // Pobieramy Twoje obietnice z pliku data.json
        const res = await fetch('data.json');
        if (!res.ok) throw new Error("Brak pliku data.json na serwerze");
        const config = await res.json();

        // Pobieramy głosy z bazy Supabase
        const { data: voteData, error: dbError } = await supabaseClient.from('votes').select('*');
        if (dbError) console.error("Błąd bazy:", dbError.message);

        // Czyścimy napis "Inicjalizacja..."
        if (app) {
            app.innerHTML = ''; 

            config.parties.forEach(p => {
                const vCount = voteData?.find(v => v.party_id === p.id)?.count || 0;
                const card = document.createElement('div');
                card.className = 'card'; // upewnij się, że masz .card w style.css
                card.style = "border: 1px solid #ccc; padding: 15px; border-radius: 8px; background: #fff; margin-bottom: 20px;";
                
                card.innerHTML = `
                    <div style="text-align:center;">
                        <img src="${p.logo}" style="height:40px; cursor:pointer;" onclick="vote('${p.id}')" alt="Głosuj">
                        <p><small>Głosów: <b id="v-${p.id}">${vCount}</b></small></p>
                    </div>
                    <h3>${p.name}</h3>
                    <ul style="padding-left: 20px;">
                        ${p.promises.map(pr => `<li class="${pr.status}">${pr.desc}</li>`).join('')}
                    </ul>
                `;
                app.appendChild(card);
            });
        }
    } catch (err) {
        if (app) app.innerHTML = `<div style="color:red; font-weight:bold;">Błąd: ${err.message}</div>`;
        console.error(err);
    }
}

// Funkcja głosowania
async function vote(id) {
    const { error } = await supabaseClient.rpc('increment_vote', { row_id: id });
    if (!error) {
        const el = document.getElementById(`v-${id}`);
        if (el) el.innerText = parseInt(el.innerText) + 1;
    } else {
        alert("Błąd podczas głosowania. Sprawdź konfigurację RPC w Supabase.");
    }
}

// Uruchomienie aplikacji
init();
