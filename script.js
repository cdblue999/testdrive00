async function loadDashboard() {
    const response = await fetch('data.json');
    const data = await response.json();
    
    document.getElementById('currency-bar').innerText = 
        `EUR: ${data.rates.EUR} PLN | USD: ${data.rates.USD} PLN`;

    const grid = document.getElementById('party-grid');
    
    data.parties.forEach(party => {
        const card = document.createElement('div');
        card.className = 'party-card';
        card.innerHTML = `
            <div class="party-header">
                <img src="${party.logo_url}" class="party-logo" onclick="vote('${party.id}')" title="Kliknij by zagłosować">
                <span class="vote-count" id="votes-${party.id}">0</span>
            </div>
            <h4>Obietnice i Realizacja</h4>
            <ul>
                ${party.promises.map(p => `
                    <li class="status-${p.status}">${p.txt}</li>
                `).join('')}
            </ul>
        `;
        grid.appendChild(card);
    });
}

const supabase = supabase.createClient('TWOJ_URL', 'TWOJ_ANON_KEY');

async function vote(partyId) {
    // Prosta logika: zwiększamy licznik w bazie o 1 dla danego partyId
    const { data, error } = await supabase
      .rpc('increment_vote', { party_id_input: partyId });

    if (error) {
        console.error('Błąd głosowania:', error);
    } else {
        updateUI(); // Odśwież licznik na stronie
    }
}
}

loadDashboard();
