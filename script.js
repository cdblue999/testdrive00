// ... (początek funkcji init bez zmian)

    try {
        // 1. Dane rynkowe i makro (Stan na kwiecień 2026)
        const nbpRes = await fetch('https://api.nbp.pl/api/exchangerates/tables/A/?format=json').then(r => r.json());
        const eur = nbpRes[0].rates.find(x => x.code === 'EUR').mid;
        const usd = nbpRes[0].rates.find(x => x.code === 'USD').mid;
        
        const gus = { 
            inflacja: "3.2%", 
            pkb: "+2.8%", 
            deficytPct: "5.1%", 
            deficytKwota: "182 mld PLN", 
            okres: "rok 2025" 
        };

        if (ratesEl) {
            ratesEl.innerHTML = `
                <div style="border-bottom:1px dashed #e2e8f0; padding-bottom:6px; margin-bottom:6px; font-size:16px;">
                    EUR: <b>${eur}</b> | USD: <b>${usd}</b>
                </div>
                <div style="color:#475569; line-height:1.6;">
                    Inflacja: <b>${gus.inflacja}</b> | PKB: <b>${gus.pkb}</b><br>
                    Deficyt: <b style="color:var(--amarant)">${gus.deficytPct} PKB</b> 
                    <span style="font-size:11px; color:#94a3b8; letter-spacing:0;">
                        (${gus.deficytKwota} / ${gus.okres})
                    </span>
                </div>`;
        }

// ... (reszta skryptu bez zmian)
