const SB_URL = 'https://amixcppknszjfscnepnx.supabase.co';
const SB_KEY = 'sb_publishable_8pZgzv2BXthAUoBppO8U3A_edhabo2J';
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

async function init() {
    const app = document.getElementById('app');
    console.log("Start inicjalizacji...");

    try {
        const res = await fetch('data.json');
        if (!res.ok) throw new Error("Nie znaleziono pliku data.json na serwerze!");
        
        const config = await res.json();
        console.log("Dane załadowane:", config);

        app.innerHTML = ''; // Czyścimy napis "Inicjalizacja..."
        
        config.parties.forEach(p => {
            const card = document.createElement('div');
            card.className = 'party-col';
            card.innerHTML = `<h3>${p.name}</h3>`;
            app.appendChild(card);
        });

    } catch (e) {
        console.error("BŁĄD:", e);
        app.innerHTML = `<div style="color:red; padding:20px; background:white;">
            <h3>Wystąpił problem:</h3>
            <p>${e.message}</p>
            <p>Sprawdź czy plik <b>data.json</b> został wgrany na Netlify.</p>
        </div>`;
    }
}
