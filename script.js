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

function vote(id) {
    let count = document.getElementById(`votes-${id}`);
    count.innerText = parseInt(count.innerText) + 1;
    alert(`Oddano głos na ${id.toUpperCase()}! (W wersji docelowej zapis w bazie Supabase)`);
}

loadDashboard();
