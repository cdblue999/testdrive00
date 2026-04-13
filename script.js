ratesEl.innerHTML = `
            <div style="color:#475569; line-height:1.6;">
                <div style="margin-bottom: 2px;">
                    EUR: <b>${eur}</b> | USD: <b>${usd}</b>
                </div>
                <div>
                    ${t.inflation}: <b>3.2%</b> | ${t.gdp}: <b>+2.8%</b><br>
                    ${t.deficit}: <b style="color:var(--amarant)">5.1% ${currentLang === 'de' ? 'BIP' : 'GDP'}</b> 
                    <span style="font-size:11px; color:#94a3b8; display:block; margin-top:2px;">
                        / 182 mld PLN (${t.period})
                    </span>
                </div>
            </div>`;
