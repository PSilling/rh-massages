var Localize = require('localize');

/**
 * Based on current localization token returns
 * input String in the selected language.
 */
const myLocalize = new Localize({
    // view names
    "Facilities": {
      "cs": "Budovy"
    },
    "Massages": {
      "cs": "Masáže"
    },
    "Massages in ": {
      "cs": "Masáže v "
    },
    "My Massages": {
      "cs": "Moje masáže"
    },
    "Massages Archive": {
      "cs": "Archiv masáží"
    },

    // other titles
    "New Massage": {
      "cs": "Nová masáž"
    },
    "Create Massages": {
      "cs": "Vytvořit masáže"
    },
    "Edit Massage": {
      "cs": "Upravit masáž"
    },
    "Edit Massages": {
      "cs": "Upravit masáže"
    },
    "Copy Massages": {
      "cs": "Zkopírovat masáže"
    },
    "New Facility": {
      "cs": "Nová budova"
    },
    "Edit Facility": {
      "cs": "Upravit budovu"
    },
    "Massage time": {
      "cs": "Čas masáže"
    },
    "Duration": {
      "cs": "Délka trvání"
    },
    "Number of repetitions": {
      "cs": "Počet opakování"
    },
    "Number of repetitions (weekly)": {
      "cs": "Počet opakování (týdně)"
    },
    "Day step per repetition": {
      "cs": "Denní skok na opakování"
    },
    "Profile": {
      "cs": "Profil"
    },
    "Logout": {
      "cs": "Odhlásit"
    },
    "Change language to czech": {
      "cs": "Změnit jazyk na angličtinu"
    },
    "Show Keycloak profile": {
      "cs": "Zobrazit Keycloak profil"
    },
    "Change masseur/masseuse": {
      "cs": "Změnit maséra/masérku"
    },
    "Later": {
      "cs": "Později"
    },
    "Earlier": {
      "cs": "Dříve"
    },
    "Shift massage date (day and time)": {
      "cs": "Posunout datum masáže (den a čas)"
    },
    "Day change": {
      "cs": "Změna dne"
    },
    "Duration change": {
      "cs": "Změna trvání"
    },
    "Days": {
      "cs": "Dny"
    },
    "Also remove all assigned clients": {
      "cs": "Také odstranit všechny zapsané klienty"
    },
    "Maximal simultaneous massage time per user would be exceeded": {
      "cs": "Maximální čas masáží na uživatele najednou by byl přesažen"
    },
    "Too late to cancel this massage": {
      "cs": "Příliš pozdě na zrušení této masáže"
    },
    "Repeat each": {
      "cs": "Opakovat v"
    },
    "Shift start": {
      "cs": "Začátek směny"
    },
    "Breaks": {
      "cs": "Přestávky"
    },
    "Normal break": {
      "cs": "Normální přestávka"
    },
    "Lunch break": {
      "cs": "Obědová přestávka"
    },
    "Lunch after": {
      "cs": "Oběd po"
    },
    "...massages": {
      "cs": "...masážích"
    },
    "Number of massages per day": {
      "cs": "Počet masáží denně"
    },
    "Rule #": {
      "cs": "Vzor #"
    },
    "Create rule": {
      "cs": "Vytvořit vzor"
    },
    "Remove rule": {
      "cs": "Odstranit vzor"
    },
    "Rule applies after": {
      "cs": "Vzor platí od"
    },
    "Import rules": {
      "cs": "Importovat vzory"
    },
    "Export rules": {
      "cs": "Exportovat vzory"
    },
    "More": {
      "cs": "Více"
    },
    "Less": {
      "cs": "Méně"
    },
    "Show all": {
      "cs": "Zobrazit vše"
    },
    "Collapse all": {
      "cs": "Sbalit vše"
    },

    // table items
    "Date": {
      "cs": "Datum"
    },
    "Time": {
      "cs": "Čas"
    },
    "Masseur/Masseuse": {
      "cs": "Masér/Masérka"
    },
    "Facility": {
      "cs": "Budova"
    },
    "Status": {
      "cs": "Status"
    },
    "Event": {
      "cs": "Event"
    },
    "Add to Google Calendar": {
      "cs": "Přidat do Google kalendáře"
    },
    "Free": {
      "cs": "Volno"
    },
    "Full": {
      "cs": "Plno"
    },
    "Name": {
      "cs": "Název"
    },
    "Unauthorized": {
      "cs": "Neautorizováno"
    },
    "Assigned": {
      "cs": "Zapsáno"
    },
    "View as a table": {
      "cs": "Zobrazit jako tabulku"
    },
    "View as panels": {
      "cs": "Zobrazit jako panely"
    },
    "only free massages": {
      "cs": "pouze volné masáže"
    },
    "Per page": {
      "cs": "Na stránku"
    },

    // actions
    "Delete": {
      "cs": "Smazat"
    },
    "Delete all": {
      "cs": "Smazat vše"
    },
    "Delete selected": {
      "cs": "Smazat vybrané"
    },
    "Edit": {
      "cs": "Upravit"
    },
    "Edit selected": {
      "cs": "Upravit vybrané"
    },
    "Add": {
      "cs": "Přidat"
    },
    "Create": {
      "cs": "Vytvořit"
    },
    "Batch addition": {
      "cs": "Dávkové přidání"
    },
    "Copy": {
      "cs": "Zkopírovat"
    },
    "Cancel": {
      "cs": "Zrušit"
    },
    "Force cancel": {
      "cs": "Vynutit zrušení"
    },
    "Dismiss": {
      "cs": "Zrušit"
    },
    "Now": {
      "cs": "Nyní"
    },
    "Proceed": {
      "cs": "Pokračovat"
    },
    "Proceed and add to calendar": {
      "cs": "Pokračovat a přidat do kalendáře"
    },
    "Assign me": {
      "cs": "Zapsat se"
    },
    "Copy selected": {
      "cs": "Kopírovat vybrané"
    },

    // notification messages
    "Your request has been successful.": {
      "cs": "Váš požadavek byl úspěšný."
    },
    "Your request has ended unsuccessfully.": {
      "cs": "Váš požadavek skončil neúspěšně."
    },
    "An error occurred!": {
      "cs": "Nastala chyba!"
    },
    "Warning": {
      "cs": "Upozornění"
    },
    "Not all massages were edited as in some cases the new date would have been before now.": {
      "cs": "Ne všechny masáže byly změněny, protože v některých případech by byl nový termín před nynějškem."
    },
    "page doesn't exist:": {
      "cs": "stránka neexistuje:"
    },
    "Back to main page": {
      "cs": "Zpět na hlavní stránku"
    },
    "None": {
      "cs": "Žádné"
    },
    "Go to massages": {
      "cs": "Jít na masáže"
    },
    "Name is required!": {
      "cs": "Název je vyžadován!"
    },
    "Masseuse is required!": {
      "cs": "Jméno masérky je vyžadováno!"
    },
    "At least one repeat day is required!": {
      "cs": "Alespoň jeden opakovací den je vyžadován!"
    },
    "Search": {
      "cs": "Vyhledávání"
    },
    "Today": {
      "cs": "Dnes"
    },
    "This week": {
      "cs": "Tento týden"
    },
    "Next week": {
      "cs": "Další týden"
    },
    "This month": {
      "cs": "Tento měsíc"
    },
    "Next month": {
      "cs": "Další měsíc"
    },
    "Later than next week": {
      "cs": "Později než další týden"
    },
    "Later than next month": {
      "cs": "Později než další měsíc"
    },
    " in ": {
      "cs": " v "
    },

    // text messages
    "Action confirmation": {
      "cs": "Potvrzení akce"
    },
    "Are you sure? This action cannot be reverted.": {
      "cs": "Jste si jisti? Tato akce nemůže být navrácena."
    },
    "Are you sure you want to assign yourself to this massage?": {
      "cs": "Jste si jisti, že se chcete zapsat na tuto masáž?"
    },
    "Are you sure you want to cancel this massage?": {
      "cs": "Jste si jisti, že chcete zrušit tuto masáž?"
    },
    "Are you sure you want to cancel a massage that is already assigned?": {
      "cs": "Jste si jisti, že chcete zrušit masáž, která je již zapsaná?"
    },
    "Massage in facility": {
      "cs": "Masáž v budově"
    },
    "FileReader API isn't supported by your browser.": {
      "cs": "FileReader API není vaším prohlížeči podporované."
    },
    "Invalid import file.": {
      "cs": "Importovaný soubor je neplatný."
    },
    "Send me information about massages": {
      "cs": "Zasílejte mi informace o masážích"
    },

    // moment localization
    "monday": {
      "cs": "pondělí"
    },
    "tuesday": {
      "cs": "úterý"
    },
    "wednesday": {
      "cs": "středu"
    },
    "thursday": {
      "cs": "čtvrtek"
    },
    "friday": {
      "cs": "pátek"
    },
    "saturday": {
      "cs": "sobotu"
    },
    "sunday": {
      "cs": "neděli"
    },
    "January_February_March_April_May_June_July_August_September_October_November_December": {
      "cs": "Leden_Únor_Březen_Duben_Květen_Červen_Červenec_Srpen_Září_Říjen_Listopad_Prosinec"
    },
    "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec": {
      "cs": "Led_Úno_Bře_Dub_Kvě_Čer_Čvc_Srp_Zář_Říj_Lis_Pro"
    },
    "Su_Mo_Tu_We_Th_Fr_Sa": {
      "cs": "Ne_Po_Út_St_Čt_Pá_So"
    },
    "hh:mm A": {
      "cs": "HH:mm"
    },
    "DD/MM/YYYY": {
      "cs": "DD. MM. YYYY"
    }
});

if (localStorage.getItem("sh-locale") === 'en') {
  myLocalize.setLocale("en");
} else {
  myLocalize.setLocale("cs");
  localStorage.setItem("sh-locale", "cs");
}

export default myLocalize
