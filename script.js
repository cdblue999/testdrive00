// ... (Konfiguracja Supabase i liczniki wyborcze bez zmian) ...

async function init() {
    const app = document.getElementById('app');
    const ratesEl = document.getElementById('rates');
    updateElectionCounters();

    try {
        // Waluty i GUS (kod bez zmian...)
        const nbpRes = await fetch('https://api.nbp.pl/api/exchangerates/tables/A/?format=json').then(r => r.json());
        const eur = nbpRes[0].rates.find(x => x.code === 'EUR').mid;
        const usd = nbpRes[0].rates.find(x => x.code === 'USD').mid;
        const gus = { inflacja: "3.2%", pkb: "+2.8%", bezrobocie: "4.9%", pensja: "8 450 PLN" };

        if (ratesEl) {
            ratesEl.innerHTML = `
                <div style="border-bottom:1px dashed #eee; padding-bottom:3px; margin-bottom:3px;">
                    EUR: <b>${eur}</b> | USD: <b>${usd}</b>
                </div>
                <div style="color:#666; font-size:9px;">
                    Inflacja: <b>${gus.inflacja}</b> | PKB: <b>${gus.pkb}</b><br>
                    Bezrobocie: <b>${gus.bezrobocie}</b> | Śr. płaca: <b>${gus.pensja}</b>
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
                        <div class="party-header">
                            <img src="${p.logo}" class="logo" alt="${p.name}">
                        </div>
                        <h3>${p.name}</h3>
                    </a>

                    <div class="progress-container">
                        <div style="font-size: 8px; text-align:right; margin-bottom:2px;">Realizacja programu: ${percent}%</div>
                        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${percent}%"></div></div>
                    </div>

                    <ul>
                        ${p.promises.map(pr => {
                            let icon = pr.status === 'done' ? '✓' : (pr.status === 'failed' ? '✕' : '•');
                            return `<li class="${pr.status}"><span style="font-weight:bold;width:12px;display:inline-block">${icon}</span><a href="${pr.url}" target="_blank" rel="noopener noreferrer" class="source-link">${pr.desc}</a></li>`;
                        }).join('')}
                    </ul>

                    <div class="info-section">
                        <div class="section-label">Weryfikacja i Krytyka</div>
                        ${p.critical_sources ? p.critical_sources.map(src => `
                            <a href="${src.url}" target="_blank" rel="noopener noreferrer" class="sub-link">
                                <img src="${src.icon}" class="mini-icon">
                                <span>${src.text}</span>
                            </a>
                        `).join('') : ''}
                    </div>

                    <div class="info-section">
                        <div class="section-label">Inicjatywa ustawodawcza (Sejm X)</div>
                        ${p.legislative_initiatives ? p.legislative_initiatives.map(leg => `
                            <a href="${leg.url}" target="_blank" rel="noopener noreferrer" class="sub-link">
                                <div class="sejm-icon">S</div>
                                <span>${leg.text}</span>
                            </a>
                        `).join('') : ''}
                    </div>
                `;
                app.appendChild(card);
            });
        }
    } catch (err) { console.error(err); }
}

// ... (funkcja vote bez zmian) ...
init();
