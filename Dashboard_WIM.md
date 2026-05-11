const dzis = luxon.DateTime.now();
const projekty = dv.pages("#Projekt").where(p => p.Zaawansowanie_Realne < p.Zaawansowanie_Planowane);

dv.header(2, "🚩 Projekty zagrożone (Opóźnienia)");

dv.table(["Projekt", "Wykonawca", "KM - Termin", "Status"], 
    projekty.map(p => [
        p.file.link, 
        p.Wykonawca, 
        p.Umowa_DO, 
        "⚠️ Opóźnienie: " + (p.Zaawansowanie_Planowane - p.Zaawansowanie_Realne) + "%"
    ])
);
