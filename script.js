// ... (Nagłówek tłumaczeń i Supabase bez zmian) ...

async function init() {
    const app = document.getElementById('app');
    const t = translations[currentLang] || translations['pl'];
    
    // UI Static (Rates, Elections, etc. - jak wcześniej)
    
    try {
        const res = await fetch('data.json');
        const config = await res.json();
        const { data: voteData } = await supabaseClient.from('votes').select('*');

        app.innerHTML = '';
        config.parties.forEach(p => {
            const votes = voteData?.find(v => v.party_id === p.id)?.count || 0;
            const partyName = p[`name_${currentLang}`] || p.name_pl;
            
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <button class="vote-btn" onclick="vote('${p.id}')" style="width:100%; display:flex; justify-content:space-between; padding:8px; font-family:var(--font-data); font-size:10px; cursor:pointer; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; margin-bottom:15px;">
                    <span>${t.sentiment}</span> <b id="v-${p.id}">${votes}</b>
                </button>

                <div style="height:60px; display:flex; align-items:center; justify-content:center; margin-bottom:10px;">
                    <img src="${p.logo}" style="max-height:100%; max-width:100%; object-fit:contain;" 
                         onerror="this.onerror=null; this.outerHTML='<b style=\'font-family:var(--font-data); font-size:14px; color:#94a3b8;\'>${partyName}</b>';">
                </div>

                <h3 style="text-align:center; margin:0 0 15px 0; font-weight:900;">${partyName}</h3>

                <ul style="list-style:none; padding:0; margin:0;">
                    ${p.promises.map(pr => `
                        <li class="${pr.status}" style="display:flex; align-items:center; gap:8px; padding:8px 0; border-bottom:1px solid #f8fafc;">
                            <span style="font-weight:bold; width:15px; flex-shrink:0;">${pr.status==='done'?'✓':(pr.status==='failed'?'✕':'•')}</span>
                            <a href="${pr.url}" target="_blank" style="text-decoration:none; color:inherit; flex-grow:1; font-size:11.5px;">${pr[`desc_${currentLang}`] || pr.desc_pl}</a>
                            ${pr.cost ? `<span class="cost-tag">${pr.cost}</span>` : ''}
                        </li>
                    `).join('')}
                </ul>

                <div class="critical-section">
                    <div class="critical-title">Analiza krytyczna / Media</div>
                    ${p.critical_links ? p.critical_links.map(cl => `
                        <a href="${cl.url}" target="_blank" class="critical-link">→ ${cl[`label_${currentLang}`] || cl.label_pl}</a>
                    `).join('') : '<span style="font-size:10px; color:#cbd5e1;">Brak danych archiwalnych</span>'}
                </div>
            `;
            app.appendChild(card);
        });
    } catch (e) { app.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:50px;">Błąd krytyczny danych. Sprawdź format data.json</div>'; }
}

// ... (Reszta funkcji bez zmian) ...
