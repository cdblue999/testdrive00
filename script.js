/*
 * Copyright (C) 2026 ZMS
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

'use strict';

// === CONFIGURATION & STATE ===
const CONFIG = {
    supabaseUrl: 'https://amixcppknszjfscnepnx.supabase.co',
    supabaseKey: 'sb_publishable_8pZgzv2BXthAUoBppO8U3A_edhabo2J',
    rssUrl: 'https://news.google.com/rss/search?q=Polska+gospodarka+sejm&hl=pl&gl=PL&ceid=PL:pl',
    rssProxy: 'https://api.rss2json.com/v1/api.json',
    cacheTtlMs: 15 * 60 * 1000 // 15 minutes
};

const I18N = {
    pl: {
        appTitle: "terminal obywatelski",
        asOf: "stan na dziś:",
        marketTitle: "RYNEK I WSKAŹNIKI (LIVE)",
        electionsTitle: "KADENCJA SEJMU I WYBORY",
        legendTitle: "STATUS REALIZACJI",
        sejmTitle: "UKŁAD SIŁ W SEJMIE (WIĘKSZOŚĆ: 231)",
        coalitionGov: "Koalicja rządowa",
        opposition: "Opozycja",
        coalitionPartiesDetail: "KO (157) + TD (65) + Lewica (26)",
        oppositionPartiesDetail: "PiS (194) + Konf (18)",
        mandates: "Mandatów",
        sentiment: "Popierasz?",
        votedSentiment: "Poparto",
        critTitle: "ANALIZA KRYTYCZNA / FAKTCHECKING",
        lastElection: "Ostatnie wybory:",
        nextElection: "Kolejne wybory:",
        termProgress: "Postęp kadencji:",
        days: "dni",
        statusDone: "Zrealizowane",
        statusPending: "W realizacji",
        statusFailed: "Niezrealizowane / Zarzucone",
        allFilter: "Wszystkie",
        govFilter: "🏛️ Koalicja",
        oppFilter: "🏛️ Opozycja",
        searchPlaceholder: "Szukaj obietnicy (np. ZUS, podatki)...",
        totalCost: "Szacowany koszt:",
        realizationRate: "Realizacja:",
        notesLabel: "Uwagi / Zbieżność:",
        noData: "Brak danych",
        fuelTitle: "Średnie ceny paliw (detal)",
        inflation: "Inflacja",
        gdp: "Wzrost PKB",
        deficit: "Deficyt budżetowy",
        coalitionRulesText: "🏛️ Jak powstaje rząd i koalicja? Zasady (Art. 154-155 Konstytucji RP)",
        isapText: "📜 Oficjalna Baza Ustaw i Tekstów Jednolitych (ISAP Sejm RP)",
        newsFallback: " PILNE: Polska gospodarka w fazie stabilizacji • GUS publikuje nowe dane makroekonomiczne • ",
        footer: "© 2026 terminal obywatelski. Niezależny agregator danych publicznych (NBP, GUS, MF, Sejm RP).<br>Oprogramowanie open-source na licencji GPLv3. Copyright by ZMS."
    },
    en: {
        appTitle: "citizen terminal",
        asOf: "as of today:",
        marketTitle: "MARKETS & INDICATORS (LIVE)",
        electionsTitle: "PARLIAMENTARY TERM & ELECTIONS",
        legendTitle: "PROMISE STATUS",
        sejmTitle: "PARLIAMENTARY BALANCE (MAJORITY: 231)",
        coalitionGov: "Government Coalition",
        opposition: "Opposition",
        coalitionPartiesDetail: "KO (157) + TD (65) + Lewica (26)",
        oppositionPartiesDetail: "PiS (194) + Konf (18)",
        mandates: "Seats",
        sentiment: "Support?",
        votedSentiment: "Supported",
        critTitle: "CRITICAL ANALYSIS / FACT-CHECK",
        lastElection: "Last elections:",
        nextElection: "Next elections:",
        termProgress: "Term progress:",
        days: "days",
        statusDone: "Fulfilled",
        statusPending: "In progress",
        statusFailed: "Unfulfilled / Abandoned",
        allFilter: "All",
        govFilter: "🏛️ Coalition",
        oppFilter: "🏛️ Opposition",
        searchPlaceholder: "Search promises (e.g. taxes, health)...",
        totalCost: "Estimated cost:",
        realizationRate: "Progress:",
        notesLabel: "Notes / Intersections:",
        noData: "No data",
        fuelTitle: "Avg. fuel prices (retail)",
        inflation: "Inflation",
        gdp: "GDP Growth",
        deficit: "Budget deficit",
        coalitionRulesText: "🏛️ Government formation & coalition rules (Art. 154-155 Constitution)",
        isapText: "📜 Official Database of Polish Laws (ISAP Sejm RP)",
        newsFallback: " BREAKING: Polish economy stabilizes • Statistical office publishes macro data • ",
        footer: "© 2026 Citizen Terminal. Independent public data aggregator (NBP, GUS, MF, Sejm).<br>Open-source software licensed under GPLv3. Copyright by ZMS."
    },
    de: {
        appTitle: "Bürgerterminal",
        asOf: "Stand heute:",
        marketTitle: "MÄRKTE & INDIKATOREN (LIVE)",
        electionsTitle: "PARLAMENTSWAHLEN & LEGISLATUR",
        legendTitle: "STATUS DER VERSPRECHEN",
        sejmTitle: "MEHRHEITSVERHÄLTNISSE (MEHRHEIT: 231)",
        coalitionGov: "Regierungskoalition",
        opposition: "Opposition",
        coalitionPartiesDetail: "KO (157) + TD (65) + Lewica (26)",
        oppositionPartiesDetail: "PiS (194) + Konf (18)",
        mandates: "Mandate",
        sentiment: "Zustimmung?",
        votedSentiment: "Zugestimmt",
        critTitle: "KRITISCHE ANALYSE / FAKTCHECK",
        lastElection: "Letzte Wahlen:",
        nextElection: "Nächste Wahlen:",
        termProgress: "Fortschritt:",
        days: "Tage",
        statusDone: "Erfüllt",
        statusPending: "In Bearbeitung",
        statusFailed: "Nicht erfüllt / Verworfen",
        allFilter: "Alle",
        govFilter: "🏛️ Koalition",
        oppFilter: "🏛️ Opposition",
        searchPlaceholder: "Versprechen suchen...",
        totalCost: "Geschätzte Kosten:",
        realizationRate: "Realisierung:",
        notesLabel: "Anmerkungen:",
        noData: "Keine Daten",
        fuelTitle: "Durchschnittliche Kraftstoffpreise",
        inflation: "Inflation",
        gdp: "BIP-Wachstum",
        deficit: "Haushaltsdefizit",
        coalitionRulesText: "🏛️ Regierungsbildung & Koalitionsregeln (Art. 154-155 Verfassung)",
        isapText: "📜 Gesetzessammlung des polnischen Parlaments (ISAP)",
        newsFallback: " EILMELDUNG: Wirtschaftswachstum stabil • Statistische Kennzahlen aktualisiert • ",
        footer: "© 2026 Bürgerterminal. Unabhängiger Datenaggregator.<br>Open-Source unter GPLv3. Copyright by ZMS."
    }
};

const state = {
    lang: localStorage.getItem('to_lang') || 'pl',
    theme: localStorage.getItem('to_theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
    filter: 'all',
    search: '',
    data: null,
    nbpRates: null,
    news: null,
    votes: JSON.parse(localStorage.getItem('to_local_votes') || '{}'),
    userVoted: JSON.parse(localStorage.getItem('to_user_voted') || '{}')
};

// === UTILITY HELPERS ===
function getT() {
    return I18N[state.lang] || I18N.pl;
}

function getStoredCache(key) {
    try {
        const item = sessionStorage.getItem(`to_cache_${key}`);
        if (!item) return null;
        const parsed = JSON.parse(item);
        if (Date.now() - parsed.ts < CONFIG.cacheTtlMs) {
            return parsed.val;
        }
    } catch (_) {}
    return null;
}

function setStoredCache(key, val) {
    try {
        sessionStorage.setItem(`to_cache_${key}`, JSON.stringify({ ts: Date.now(), val }));
    } catch (_) {}
}

function escapeHtml(str) {
    return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// === DATA FETCHING ===
async function fetchNbpRates() {
    const cached = getStoredCache('nbp');
    if (cached) return cached;

    try {
        const res = await fetch('https://api.nbp.pl/api/exchangerates/tables/A/?format=json', {
            signal: AbortSignal.timeout(4000)
        });
        if (!res.ok) throw new Error(`NBP HTTP ${res.status}`);
        const json = await res.json();
        const rates = json[0]?.rates || [];
        const eur = rates.find(x => x.code === 'EUR')?.mid;
        const usd = rates.find(x => x.code === 'USD')?.mid;
        const result = {
            eur: eur ? eur.toFixed(4) : '4,3955',
            usd: usd ? usd.toFixed(4) : '3,9251'
        };
        setStoredCache('nbp', result);
        return result;
    } catch (_) {
        return { eur: '4,40', usd: '3,93' };
    }
}

async function fetchNewsFeed() {
    const cached = getStoredCache('news');
    if (cached) return cached;

    try {
        const res = await fetch(`${CONFIG.rssProxy}?rss_url=${encodeURIComponent(CONFIG.rssUrl)}`, {
            signal: AbortSignal.timeout(4000)
        });
        if (!res.ok) throw new Error(`RSS HTTP ${res.status}`);
        const data = await res.json();
        if (data.status === 'ok' && Array.isArray(data.items)) {
            const items = data.items.slice(0, 10).map(i => ({
                title: i.title.replace(/\.\.\./g, '').trim(),
                link: i.link || ''
            }));
            setStoredCache('news', items);
            return items;
        }
    } catch (_) {}
    return null;
}

async function fetchMainData() {
    const res = await fetch('data.json');
    if (!res.ok) throw new Error('Nie można pobrać data.json');
    return await res.json();
}

// === VOTING LOGIC ===
async function vote(partyId) {
    if (state.userVoted[partyId]) return;

    state.votes[partyId] = (state.votes[partyId] || 0) + 1;
    state.userVoted[partyId] = true;
    localStorage.setItem('to_local_votes', JSON.stringify(state.votes));
    localStorage.setItem('to_user_voted', JSON.stringify(state.userVoted));

    const voteEl = document.getElementById(`v-${partyId}`);
    const btnEl = document.getElementById(`btn-${partyId}`);
    if (voteEl) voteEl.innerText = state.votes[partyId];
    if (btnEl) {
        btnEl.classList.add('voted');
        btnEl.disabled = true;
        const label = btnEl.querySelector('.vote-label');
        if (label) label.innerText = getT().votedSentiment;
    }

    try {
        await fetch(`${CONFIG.supabaseUrl}/rest/v1/rpc/increment_vote`, {
            method: 'POST',
            headers: {
                apikey: CONFIG.supabaseKey,
                Authorization: `Bearer ${CONFIG.supabaseKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ row_id: partyId }),
            signal: AbortSignal.timeout(2000)
        });
    } catch (_) {}
}

// === COMPUTED METRICS ===
function calculateTotalCost(promises) {
    let sum = 0;
    let hasApprox = false;

    for (const pr of promises) {
        if (!pr.cost || pr.cost === 'n/d') continue;
        const clean = pr.cost.replace(',', '.');
        const numMatch = clean.match(/([\d\.]+)/);
        if (numMatch) {
            const val = parseFloat(numMatch[1]);
            if (clean.includes('oszcz')) {
                sum -= val;
            } else {
                sum += val;
            }
        }
        if (pr.cost.includes('~')) hasApprox = true;
    }

    if (sum === 0) return null;
    return `${hasApprox ? '~' : ''}${sum % 1 === 0 ? sum : sum.toFixed(1)} mld zł`;
}

// === RENDERING FUNCTIONS ===
function renderTicker() {
    const t = getT();
    const container = document.getElementById('ticker-content');
    if (!container) return;

    if (!state.news || !state.news.length) {
        container.innerHTML = t.newsFallback + t.newsFallback;
        return;
    }

    const urgentRegex = /pilne|rcb|alert|ostrzeżenie|komunikat|breaking/im;
    const html = state.news.map(item => {
        const titleSafe = escapeHtml(item.title);
        const isUrgent = urgentRegex.test(item.title);
        const inner = isUrgent ? `<span class="urgent">${titleSafe}</span>` : titleSafe;
        if (item.link) {
            return `<a href="${escapeHtml(item.link)}" target="_blank" rel="noopener noreferrer" class="news-link">${inner}</a>`;
        }
        return inner;
    }).join(' • ') + ' • ';

    container.innerHTML = html + html;
}

function renderMetrics() {
    const t = getT();
    const ind = state.data?.indicators || {};
    const fuel = ind.fuel || { pb95: '6,48', on: '6,22', lpg: '2,89' };

    // 1. Markets & Indicators panel
    const ratesEl = document.getElementById('rates-content');
    if (ratesEl) {
        const eur = state.nbpRates?.eur || '4,40';
        const usd = state.nbpRates?.usd || '3,93';
        ratesEl.innerHTML = `
            <div class="data-row"><span>EUR:</span> <strong>${eur} zł</strong></div>
            <div class="data-row"><span>USD:</span> <strong>${usd} zł</strong></div>
            <div class="data-row"><span>${t.inflation}:</span> <strong>${ind.inflation || '3.2%'}</strong></div>
            <div class="data-row"><span>${t.gdp}:</span> <strong>${ind.gdp || '+2.8%'}</strong></div>
            <div class="data-row" style="color:var(--amarant);"><span>${t.deficit}:</span> <strong>${ind.deficit || '5.1% GDP'}</strong></div>
            <hr style="border:none;border-top:1px solid var(--card-border);margin:6px 0;">
            <div class="data-row"><span>Pb95: <strong>${fuel.pb95}</strong></span> <span>ON: <strong>${fuel.on}</strong></span> <span>LPG: <strong>${fuel.lpg}</strong></span></div>
        `;
    }

    // 2. Elections & Parliamentary Term panel
    const electEl = document.getElementById('elections-content');
    if (electEl) {
        const now = new Date();
        const start = new Date('2023-10-15');
        const end = new Date('2027-10-17');
        const daysPast = Math.max(0, Math.floor((now - start) / (1000 * 60 * 60 * 24)));
        const daysLeft = Math.max(0, Math.floor((end - now) / (1000 * 60 * 60 * 24)));
        const totalTerm = Math.floor((end - start) / (1000 * 60 * 60 * 24));
        const pctElapsed = Math.min(100, Math.round((daysPast / totalTerm) * 100));

        electEl.innerHTML = `
            <div class="data-row"><span>${t.lastElection}</span> <strong>${daysPast} ${t.days} temu</strong></div>
            <div class="data-row"><span>${t.nextElection}</span> <strong>za ${daysLeft} ${t.days}</strong></div>
            <div style="margin-top:6px;">
                <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--text-muted);margin-bottom:2px;">
                    <span>${t.termProgress}</span>
                    <span>${pctElapsed}%</span>
                </div>
                <div style="height:6px;background:var(--card-border);border-radius:3px;overflow:hidden;">
                    <div style="height:100%;width:${pctElapsed}%;background:var(--amarant);border-radius:3px;"></div>
                </div>
            </div>
        `;
    }

    // 3. Legend Panel
    const legendEl = document.getElementById('legend-content');
    if (legendEl) {
        legendEl.innerHTML = `
            <div class="data-row"><span><strong style="color:var(--status-done);">✓</strong> ${t.statusDone}</span></div>
            <div class="data-row"><span><strong style="color:var(--status-pending);">•</strong> ${t.statusPending}</span></div>
            <div class="data-row"><span><strong style="color:var(--status-failed);">✕</strong> ${t.statusFailed}</span></div>
        `;
    }

    // 4. Sejm Majority Breakdown Panel & Coalition Link
    const sejmEl = document.getElementById('sejm-content');
    if (sejmEl && state.data?.parties) {
        let govMandates = 0;
        let oppMandates = 0;
        state.data.parties.forEach(p => {
            if (p.coalition === 'government') govMandates += p.mandates;
            else oppMandates += p.mandates;
        });

        const govPct = (govMandates / 460) * 100;
        const oppPct = (oppMandates / 460) * 100;

        sejmEl.innerHTML = `
            <div class="data-row" style="font-size:11.5px;">
                <span style="color:#2563eb;font-weight:700;" title="${t.coalitionPartiesDetail}">🏛️ ${t.coalitionGov}: ${govMandates}</span>
                <span style="color:#dc2626;font-weight:700;" title="${t.oppositionPartiesDetail}">🏛️ ${t.opposition}: ${oppMandates}</span>
            </div>
            <div class="majority-bar-container" title="Większość bezwzględna w Sejmie: 231 głosów">
                <div class="majority-threshold-line" title="Większość 231"></div>
                <div class="maj-seg" style="width:${govPct}%;background:#2563eb;"></div>
                <div class="maj-seg" style="width:${oppPct}%;background:#dc2626;"></div>
            </div>
            <div style="display:flex;justify-content:space-between;font-size:9.5px;color:var(--text-muted);margin-bottom:8px;">
                <span>0</span>
                <span>Większość: 231</span>
                <span>460</span>
            </div>
            <div style="border-top:1px dashed var(--card-border);padding-top:6px;">
                <a href="https://isap.sejm.gov.pl/isap.nsf/DocDetails.xsp?id=WDU19970780483" target="_blank" rel="noopener noreferrer" style="font-size:10.5px;color:var(--text-secondary);text-decoration:none;display:block;" onmouseover="this.style.color='var(--amarant)'" onmouseout="this.style.color='var(--text-secondary)'">
                    ${t.coalitionRulesText} ↗
                </a>
            </div>
        `;
    }
}

function renderCards() {
    const t = getT();
    const app = document.getElementById('app');
    if (!app || !state.data?.parties) return;

    app.innerHTML = '';

    const query = state.search.toLowerCase().trim();

    state.data.parties.forEach(party => {
        const partyName = party[`name_${state.lang}`] || party.name_pl;
        const coalitionRole = party[`coalition_label_${state.lang}`] || (party.coalition === 'government' ? t.coalitionGov : t.opposition);
        const votes = state.votes[party.id] || 0;
        const isVoted = !!state.userVoted[party.id];

        // Filter by coalition or status
        if (state.filter === 'coalition' && party.coalition !== 'government') return;
        if (state.filter === 'opposition' && party.coalition !== 'opposition') return;

        let filteredPromises = party.promises;
        if (state.filter === 'done' || state.filter === 'pending' || state.filter === 'failed') {
            filteredPromises = filteredPromises.filter(pr => pr.status === state.filter);
        }

        if (query) {
            filteredPromises = filteredPromises.filter(pr => {
                const desc = (pr[`desc_${state.lang}`] || pr.desc_pl || '').toLowerCase();
                const note = (pr[`note_${state.lang}`] || pr.note_pl || '').toLowerCase();
                return desc.includes(query) || note.includes(query) || partyName.toLowerCase().includes(query);
            });
            if (!filteredPromises.length && !partyName.toLowerCase().includes(query)) return;
        }

        const totalPromises = party.promises.length;
        const doneCount = party.promises.filter(pr => pr.status === 'done').length;
        const pendingCount = party.promises.filter(pr => pr.status === 'pending').length;
        const failedCount = party.promises.filter(pr => pr.status === 'failed').length;

        const donePct = Math.round((doneCount / totalPromises) * 100);
        const pendingPct = Math.round((pendingCount / totalPromises) * 100);
        const failedPct = Math.round((failedCount / totalPromises) * 100);

        const totalCostStr = calculateTotalCost(party.promises);
        const notes = party.promises.filter(pr => pr[`note_${state.lang}`] || pr.note_pl);

        const card = document.createElement('div');
        card.className = `card party-card-${party.coalition}`;

        const fallbackHtml = `<div class="party-logo-fallback" style="background:${party.brand_color || '#334155'};">${escapeHtml(party.short_name || 'PL')}</div>`;

        card.innerHTML = `
            <div class="card-header">
                <div class="party-logo-wrapper">
                    <img src="${escapeHtml(party.logo)}" alt="${escapeHtml(partyName)}" onerror="this.onerror=null; this.parentElement.innerHTML='${fallbackHtml}';">
                </div>
                <div class="party-info">
                    <div class="party-title-row">
                        <h3 class="party-title">${escapeHtml(partyName)}</h3>
                        <span class="coalition-badge coalition-${party.coalition}">
                            🏛️ ${escapeHtml(coalitionRole)}
                        </span>
                    </div>
                    <div class="mandates-label">${t.mandates}: ${party.mandates} / 460</div>
                </div>
            </div>

            <div class="progress-section">
                <div class="progress-header">
                    <span>${t.realizationRate} ${doneCount}/${totalPromises} (${donePct}%)</span>
                    ${totalCostStr ? `<span class="cost-tag" title="${t.totalCost}">${totalCostStr}</span>` : ''}
                </div>
                <div class="stacked-progress" title="Realizacja: ${donePct}% | W toku: ${pendingPct}% | Brak: ${failedPct}%">
                    <div class="prog-seg prog-done" style="width:${donePct}%;"></div>
                    <div class="prog-seg prog-pending" style="width:${pendingPct}%;"></div>
                    <div class="prog-seg prog-failed" style="width:${failedPct}%;"></div>
                </div>
            </div>

            <button id="btn-${party.id}" class="vote-btn ${isVoted ? 'voted' : ''}" ${isVoted ? 'disabled' : ''} onclick="vote('${party.id}')">
                <span class="vote-label">${isVoted ? t.votedSentiment : t.sentiment}</span>
                <strong id="v-${party.id}">${votes}</strong>
            </button>

            <ul class="promises-list">
                ${filteredPromises.length ? filteredPromises.map(pr => {
                    const desc = escapeHtml(pr[`desc_${state.lang}`] || pr.desc_pl);
                    const note = pr[`note_${state.lang}`] || pr.note_pl;
                    const statusClass = pr.status === 'done' ? 'done' : (pr.status === 'failed' ? 'failed' : 'pending');
                    const statusGlyph = pr.status === 'done' ? '✓' : (pr.status === 'failed' ? '✕' : '•');
                    return `
                        <li class="promise-item ${statusClass}">
                            <span class="status-icon ${statusClass}">${statusGlyph}</span>
                            <a href="${escapeHtml(pr.url)}" target="_blank" rel="noopener noreferrer" class="promise-text">
                                ${desc}${note ? '<b style="color:var(--amarant);">*</b>' : ''}
                            </a>
                            ${pr.cost ? `<span class="cost-tag">${escapeHtml(pr.cost)}</span>` : ''}
                        </li>
                    `;
                }).join('') : `<li style="padding:15px;text-align:center;color:var(--text-muted);font-size:12px;">Brak pasujących obietnic</li>`}
            </ul>

            <div class="critical-section">
                <div class="critical-title">${t.critTitle}</div>
                ${party.critical_links && party.critical_links.length ? party.critical_links.map(cl => `
                    <a href="${escapeHtml(cl.url)}" target="_blank" rel="noopener noreferrer" class="critical-link">
                        → ${escapeHtml(cl[`label_${state.lang}`] || cl.label_pl)}
                    </a>
                `).join('') : `<span style="font-size:11px;color:var(--text-muted);">${t.noData}</span>`}
            </div>

            ${notes.length ? `
                <div class="notes-block">
                    <b style="color:var(--amarant);">${t.notesLabel}</b><br>
                    ${notes.map(n => '• ' + escapeHtml(n[`note_${state.lang}`] || n.note_pl)).join('<br>')}
                </div>
            ` : ''}
        `;

        app.appendChild(card);
    });
}

function updateStaticText() {
    const t = getT();

    const dateLocales = { pl: 'pl-PL', en: 'en-GB', de: 'de-DE' };
    const formattedDate = new Intl.DateTimeFormat(dateLocales[state.lang] || 'pl-PL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(new Date());

    const dateEl = document.getElementById('current-date');
    if (dateEl) dateEl.innerText = formattedDate;

    const titleEl = document.getElementById('t-app-title');
    if (titleEl) titleEl.innerText = t.appTitle;
    const asOfEl = document.getElementById('t-as-of');
    if (asOfEl) asOfEl.innerText = t.asOf;

    const tMarkets = document.getElementById('t-markets-title');
    if (tMarkets) tMarkets.innerText = t.marketTitle;
    const tElections = document.getElementById('t-elections-title');
    if (tElections) tElections.innerText = t.electionsTitle;
    const tLegend = document.getElementById('t-legend-title');
    if (tLegend) tLegend.innerText = t.legendTitle;
    const tSejm = document.getElementById('t-sejm-title');
    if (tSejm) tSejm.innerText = t.sejmTitle;

    const isapLinkEl = document.getElementById('t-isap-link');
    if (isapLinkEl) isapLinkEl.innerText = t.isapText;

    const footerEl = document.getElementById('t-footer');
    if (footerEl) footerEl.innerHTML = t.footer;

    const chipsContainer = document.getElementById('filter-chips-container');
    if (chipsContainer) {
        chipsContainer.innerHTML = `
            <button class="chip-btn ${state.filter === 'all' ? 'active' : ''}" onclick="setFilter('all')">${t.allFilter}</button>
            <button class="chip-btn ${state.filter === 'coalition' ? 'active' : ''}" onclick="setFilter('coalition')">${t.govFilter}</button>
            <button class="chip-btn ${state.filter === 'opposition' ? 'active' : ''}" onclick="setFilter('opposition')">${t.oppFilter}</button>
            <button class="chip-btn ${state.filter === 'done' ? 'active' : ''}" onclick="setFilter('done')">✓ ${t.statusDone}</button>
            <button class="chip-btn ${state.filter === 'pending' ? 'active' : ''}" onclick="setFilter('pending')">• ${t.statusPending}</button>
            <button class="chip-btn ${state.filter === 'failed' ? 'active' : ''}" onclick="setFilter('failed')">✕ ${t.statusFailed}</button>
        `;
    }

    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.placeholder = t.searchPlaceholder;

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === state.lang);
    });
}

function renderAll() {
    updateStaticText();
    renderTicker();
    renderMetrics();
    renderCards();
}

// === INTERACTIVE HANDLERS ===
window.setLanguage = function(lang) {
    if (state.lang === lang) return;
    state.lang = lang;
    localStorage.setItem('to_lang', lang);
    renderAll();
};

window.setFilter = function(filterVal) {
    if (state.filter === filterVal) return;
    state.filter = filterVal;
    renderAll();
};

window.toggleTheme = function() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('to_theme', state.theme);
    applyTheme();
};

window.vote = vote;

function applyTheme() {
    document.documentElement.setAttribute('data-theme', state.theme);
    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn) {
        themeBtn.innerHTML = state.theme === 'dark' ? '☀️ Tryb jasny' : '🌙 Tryb ciemny';
    }
}

// === INITIALIZATION ===
async function init() {
    applyTheme();

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            state.search = e.target.value;
            renderCards();
        });
    }

    const [mainDataRes, nbpRes, newsRes] = await Promise.allSettled([
        fetchMainData(),
        fetchNbpRates(),
        fetchNewsFeed()
    ]);

    if (mainDataRes.status === 'fulfilled') {
        state.data = mainDataRes.value;
    } else {
        const app = document.getElementById('app');
        if (app) app.innerHTML = '<div style="text-align:center;padding:50px;color:var(--status-failed);">Błąd ładowania pliku data.json.</div>';
        return;
    }

    if (nbpRes.status === 'fulfilled') {
        state.nbpRates = nbpRes.value;
    }

    if (newsRes.status === 'fulfilled') {
        state.news = newsRes.value;
    }

    renderAll();
}

document.addEventListener('DOMContentLoaded', init);
