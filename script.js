// ... (Konfiguracja Supabase i liczniki bez zmian) ...

async function init() {
    // ... (kod Walut i GUS bez zmian) ...
    
    try {
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
                
                const rating = percent > 75 ? 'AAA' : (percent > 40 ? 'BBB' : 'B-');

                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `
                    <button class="vote-btn" onclick="vote('${p.id}')">
                        <span>SENTYMENT</span> <b id="v-${p.id}">${votes}</b>
                    </button>

                    <a href="${p.website}" target="_blank" rel="noopener noreferrer" class="party-link">
                        <div class="party-header"><img src="${p.logo}" class="logo" alt="${p.name}"></div>
                        <h3>${p.name} <span style="font-size:10px; color:#94a3b8;">[${rating}]</span></h3>
                    </a>

                    <div class="progress-container">
                        <div style="font-size: 8px; font-weight:700; margin-bottom:4px;">REALIZACJA: ${percent}%</div>
                        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width: ${percent}%"></div></div>
                    </div>

                    <ul>
                        ${p.promises.map(pr => `
                            <li class="${pr.status}">
                                <span style="font-weight:bold;width:12px;display:inline-block">${pr.status === 'done' ? '✓' : (pr.status === 'failed' ? '✕' : '•')}</span>
                                <a href="${pr.url}" target="_blank" rel="noopener noreferrer" style="text-decoration:none; color:inherit;">${pr.desc}</a>
                            </li>
                        `).join('')}
                    </ul>

                    <div class="compact-separator"></div>

                    <div class="bottom-info">
                        <div class="label">Audyt</div>
                        ${p.critical_sources.map(src => `
                            <a href="${src.url}" target="_blank" rel="noopener noreferrer" class="sub-link">
                                <img src="${src.icon}" class="mini-icon" onerror="this.src='https://placehold.co/14?text=i'">
                                <span>${src.text}</span>
                            </a>
                        `).join('')}
                    </div>

                    <div class="bottom-info">
                        <div class="label">Sejm</div>
                        ${p.legislative_initiatives.map(leg => `
                            <a href="${leg.url}" target="_blank" rel="noopener noreferrer" class="sub-link">
                                <div class="s-icon">S</div>
                                <span>${leg.text}</span>
                            </a>
                        `).join('')}
                    </div>
                `;
                app.appendChild(card);
            });
        }
    } catch (err) { console.error(err); }
}

// ... (funkcja vote bez zmian) ...
init();
