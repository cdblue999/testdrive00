async function init() {
    const app = document.getElementById('app');
    const ratesEl = document.getElementById('rates');
    updateElectionCounters();

    try {
        // 1. Notowania NBP
        const nbpRes = await fetch('https://api.nbp.pl/api/exchangerates/tables/A/?format=json').then(r => r.json());
        const eur = nbpRes[0].rates.find(x => x.code === 'EUR').mid;
        const usd = nbpRes[0].rates.find(x => x.code === 'USD').mid;

        // 2. Wskaźniki makro (Dane na kwiecień 2026)
        const gus = { 
            inflacja: "3.2%", 
            pkb: "+2.8%", 
            bezrobocie: "4.9%", 
            pensja: "8 450 PLN",
            deficytPct: "5.1%",      // % PKB
            deficytKwota: "182 mld", // Wartość nominalna
            deficytOkres: "rok 2025" // Okres rozliczeniowy
        };

        if (ratesEl) {
            ratesEl.innerHTML = `
                <div style="border-bottom: 1px dashed #eee; padding-bottom:3px; margin-bottom:3px;">
                    EUR: <b>${eur}</b> | USD: <b>${usd}</b>
                </div>
                <div style="color: #666; font-size: 9.5px; line-height: 1.4;">
                    Inflacja: <b>${gus.inflacja}</b> | PKB: <b>${gus.pkb}</b><br>
                    Bezrobocie: <b>${gus.bezrobocie}</b> | Śr. płaca: <b>${gus.pensja}</b><br>
                    Deficyt: <b style="color:var(--amarant)">${gus.deficytPct} PKB</b><br>
                    <span style="font-size: 8.5px; color: #999;">
                        / ${gus.deficytKwota} PLN (${gus.deficytOkres})
                    </span>
                </div>`;
        }

        // ... (reszta funkcji init bez zmian)
