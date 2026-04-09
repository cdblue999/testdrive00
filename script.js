const SB_URL = 'https://amixcppknszjfscnepnx.supabase.co';
const SB_KEY = 'sb_publishable_8pZgzv2BXthAUoBppO8U3A_edhabo2J';
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

function updateElectionCounters() {
    const now = new Date();
    const getDiff = (d1, d2) => Math.floor(Math.abs(d1 - d2) / (1000 * 60 * 60 * 24));
    document.getElementById('days-since-parl').innerText = getDiff(now, new Date('2023-10-15'));
    document.getElementById('days-since-local').innerText = getDiff(now, new Date('2024-04-07'));
    document.getElementById('days-until-parl').innerText = getDiff(new Date('2027-10-17'), now);
    document.getElementById('days-until-local').innerText = getDiff(new Date('2029-04-08'), now);
}

async function init() {
    const app = document.getElementById('app');
    const ratesEl = document.getElementById('rates');
    updateElectionCounters();

    try {
        // 1. Kursy walut NBP
        const nbpRes = await fetch('https://api.nbp.pl/api/exchangerates/tables/A/?format=json').then(r => r.json());
        const eur = nbpRes[0].rates.find(x => x.code === 'EUR').mid;
        const usd = nbpRes[0].rates.find(x => x.code === 'USD').mid;

        // 2. Wskaźniki makroekonomiczne (Dane szacunkowe na 2026)
        const gus = { 
            inflacja: "3.2%", 
            pkb: "+2.8%", 
            bezrobocie: "4.9%", 
            pensja: "8 450 PLN",
            deficyt: "5.1% PKB" // Nowy wskaźnik: Deficyt sektora finansów publicznych
        };

        if (ratesEl) {
            ratesEl.innerHTML = `
                <div style="border-bottom: 1px dashed #eee; padding-bottom:3px; margin-bottom:3px;">
                    EUR: <b style="color:#111">${eur}</b> | USD: <b style="color:#111">${usd}</b>
                </div>
                <div style="color: #666; font-size: 9.5px;">
                    Inflacja: <b>${gus.inflacja}</b> | PKB: <b>${gus.pkb}</b><br>
                    Bezrobocie: <b>${gus.bezrobocie}</b> | Pensja: <b>${gus.pensja}</b><br>
                    Deficyt: <b style="color:#b02a37">${gus.deficyt}</b>
                </div>
            `;
        }

        // 3. Pobieranie danych aplikacji
        const res = await fetch('data.json');
        const config = await res.json();
        const { data: voteData } = await supabaseClient.from('votes').select('*');

        if (app) {
