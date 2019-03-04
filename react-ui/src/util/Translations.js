/**
 * Utility class providing project localization setup.
 */

const Localize = require("localize");

/**
 * Based on current localization token returns
 * input String in the selected language.
 */
const myLocalize = new Localize({
  // view names
  Facilities: {
    cs: "Budovy"
  },
  Massages: {
    cs: "Masáže"
  },
  "Massages in ": {
    cs: "Masáže v "
  },
  "My Massages": {
    cs: "Moje masáže"
  },
  "Massages Archive": {
    cs: "Archiv masáží"
  },
  Settings: {
    cs: "Nastavení"
  },
  "User settings": {
    cs: "Uživatelská nastavení"
  },
  About: {
    cs: "O portálu"
  },
  Schedule: {
    cs: "Rozpis"
  },
  Unauthorized: {
    cs: "Neautorizováno"
  },

  // modal titles
  "New massage": {
    cs: "Nová masáž"
  },
  "Edit massage": {
    cs: "Upravit masáž"
  },
  "New facility": {
    cs: "Nová budova"
  },
  "Edit facility": {
    cs: "Upravit budovu"
  },
  Details: {
    cs: "Podrobnosti"
  },
  "Print settings": {
    cs: "Nastavení tisku"
  },
  "Action confirmation": {
    cs: "Potvrzení akce"
  },

  // button labels
  Profile: {
    cs: "Profil"
  },
  Logout: {
    cs: "Odhlásit"
  },
  Delete: {
    cs: "Smazat"
  },
  "Delete all": {
    cs: "Smazat vše"
  },
  "Delete selected": {
    cs: "Smazat vybrané"
  },
  Remove: {
    cs: "Odstranit"
  },
  Edit: {
    cs: "Upravit"
  },
  Add: {
    cs: "Přidat"
  },
  Print: {
    cs: "Tisk"
  },
  Create: {
    cs: "Vytvořit"
  },
  "New schedule": {
    cs: "Zadat rozpis"
  },
  "Force cancel": {
    cs: "Vynutit zrušení"
  },
  Dismiss: {
    cs: "Zrušit"
  },
  Proceed: {
    cs: "Pokračovat"
  },
  "Assign and add to calendar": {
    cs: "Zapsat a přidat do kalendáře"
  },
  "Assign me": {
    cs: "Zapsat se"
  },
  "Unassign me": {
    cs: "Odepsat se"
  },
  "Reload page": {
    cs: "Načíst znovu"
  },
  Import: {
    cs: "Importovat"
  },
  Export: {
    cs: "Exportovat"
  },
  "Add to Google Calendar": {
    cs: "Přidat do Google kalendáře"
  },

  // other labels and titles
  "Massage time": {
    cs: "Čas masáže"
  },
  Duration: {
    cs: "Délka trvání"
  },
  "Massage duration": {
    cs: "Délka masáže"
  },
  Contact: {
    cs: "Kontakt"
  },
  "Same as": {
    cs: "Stejně jako"
  },
  "Shift start": {
    cs: "Začátek směny"
  },
  "Shift end": {
    cs: "Konec směny"
  },
  "Break start": {
    cs: "Začátek přestávky"
  },
  "Break end": {
    cs: "Konec přestávky"
  },
  Break: {
    cs: "Přestávka"
  },
  Breaks: {
    cs: "Přestávky"
  },
  "Masseur/Masseuse": {
    cs: "Masér/Masérka"
  },
  Facility: {
    cs: "Budova"
  },
  Date: {
    cs: "Datum"
  },
  Time: {
    cs: "Čas"
  },
  Free: {
    cs: "Volno"
  },
  Name: {
    cs: "Název"
  },
  "Only free": {
    cs: "Pouze volné"
  },
  Select: {
    cs: "Vybírat"
  },
  Client: {
    cs: "Klient"
  },
  minutes: {
    cs: "minut"
  },
  "Time range": {
    cs: "Časové rozpětí"
  },
  "just today": {
    cs: "jen dnes"
  },
  "this week": {
    cs: "tento týden"
  },
  "this month": {
    cs: "tento měsíc"
  },
  "next month": {
    cs: "další měsíc"
  },
  all: {
    cs: "všechny"
  },
  "custom:": {
    cs: "vlastní:"
  },
  "For:": {
    cs: "Na:"
  },
  " (page doesn't exist): ": {
    cs: " (stránka neexistuje): "
  },
  "Back to main page": {
    cs: "Zpět na hlavní stránku"
  },
  "Go to massages": {
    cs: "Jít na masáže"
  },
  Today: {
    cs: "Dnes"
  },
  "This week": {
    cs: "Tento týden"
  },
  "Next week": {
    cs: "Další týden"
  },
  "This month": {
    cs: "Tento měsíc"
  },
  "Next month": {
    cs: "Další měsíc"
  },
  Next: {
    cs: "Další"
  },
  Previous: {
    cs: "Předchozí"
  },
  "Legend:": {
    cs: "Legenda:"
  },
  None: {
    cs: "Žádné"
  },
  Massage: {
    cs: "Masáž"
  },
  "Massage in ": {
    cs: "Masáž v "
  },
  " with ": {
    cs: " s "
  },
  Ignore: {
    cs: "Ignorovat"
  },
  "Free massage": {
    cs: "Volná masáž"
  },
  "My massage": {
    cs: "Moje masáž"
  },
  "Assigned massage": {
    cs: "Přiřazená masáž"
  },
  "I want to recieve information about ": {
    cs: "Chci dostávat informace o "
  },
  "massage changes": {
    cs: "změnách masáží"
  },
  "Visit our ": {
    cs: "Navštivte náš "
  },
  " and our ": {
    cs: "a naši "
  },
  "Report issues ": {
    cs: "Hlaste chyby "
  },
  here: {
    cs: "zde"
  },

  // notification messages
  Warning: {
    cs: "Upozornění"
  },
  "Your request has been successful.": {
    cs: "Váš požadavek byl úspěšný."
  },
  "Your request has ended unsuccessfully.": {
    cs: "Váš požadavek skončil neúspěšně."
  },
  "Cannot create a new massage in the past.": {
    cs: "Nelze vytvořit novou masáž v minulosti."
  },
  "An error occurred!": {
    cs: "Nastala chyba!"
  },
  "An unexpected error occurred during the 'GET' request!": {
    cs: "Při požadavku 'GET' nastala neočekávaná chyba!"
  },
  "Name is required!": {
    cs: "Název je vyžadován!"
  },
  "FileReader API isn't supported by your browser.": {
    cs: "FileReader API není vaším prohlížeči podporované."
  },
  "Invalid import file.": {
    cs: "Importovaný soubor je neplatný."
  },
  "An error occured!": {
    cs: "Došlo k chybě!"
  },
  "Are you sure? This action cannot be reverted.": {
    cs: "Jste si jisti? Tato akce nemůže být navrácena."
  },
  "Cannot select an unowned massage!": {
    cs: "Nelze vybrat nevlastní masáž!"
  },
  "Failed to finish the request": {
    cs: "Nešlo dokončit požadavek"
  },
  "It is possible that the selected client does not have enough massage time.": {
    cs: "Je možné, že zvolený klient nemá dostatek volného času pro masáže."
  },

  // tooltips
  "Create multiple massages at once": {
    cs: "Vytvořit více masáží najednou"
  },
  "Import previously downloaded rules": {
    cs: "Importovat dříve stažená pravidla"
  },
  "Download a configuration file that you can use to import these rules at a later date": {
    cs: "Stáhnout konfigurační soubor, který lze později použít pro importování těchto pravidel"
  },
  "When set to another day, copies the schedule from it": {
    cs: "Při nastavení na jiný den podle něj okopíruje rozpis"
  },
  "Length of the standard break after a massage": {
    cs: "Délka standardní přestávky po masáží"
  },
  "Print my massage schedule": {
    cs: "Tisk rozpisu mých masáží"
  },
  "Delete selected massages": {
    cs: "Smazat vybrané masáže"
  },
  "Clear the massage history": {
    cs: "Vyčistit historii masáží"
  },
  "Select multiple massages for batch operations": {
    cs: "Výběr více masáží pro hromadné operace"
  },
  "Display only free massages": {
    cs: "Zobrazit pouze volné masáže"
  },
  "Ignore this day when creating the massages": {
    cs: "Ignorovat tento den při tvorbě masáží"
  },
  "Create a new facility": {
    cs: "Vytvořit novou budovu"
  },
  "Create a new massage": {
    cs: "Vytvořit novou masáž"
  },
  "Change language to czech": {
    cs: "Změnit jazyk na angličtinu"
  },
  "Show Keycloak profile": {
    cs: "Zobrazit Keycloak profil"
  },
  "Maximal simultaneous massage time per user would be exceeded": {
    cs: "Maximální čas masáží na uživatele najednou by byl přesažen"
  },
  "Assigns this massage and opens a predefined Google event editor in a new tab": {
    cs: "Přiřadí zvolenou masáž a otevře předdefinovaný editor Google událostí v nové záložce"
  },
  "Opens a predefined Google event editor in a new tab": {
    cs: "Otevře předdefinovaný editor Google událostí v nové záložce"
  },
  "Too late to cancel this massage": {
    cs: "Příliš pozdě na zrušení této masáže"
  },
  "Scheduling of new and cancellation of assigned massages": {
    cs: "Rozpis nových a zrušení připsaných masáží"
  },
  "Over the limit": {
    cs: "Nad limit"
  },

  // moment localization
  January_February_March_April_May_June_July_August_September_October_November_December: {
    cs: "Leden_Únor_Březen_Duben_Květen_Červen_Červenec_Srpen_Září_Říjen_Listopad_Prosinec"
  },
  Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec: {
    cs: "Led_Úno_Bře_Dub_Kvě_Čer_Čvc_Srp_Zář_Říj_Lis_Pro"
  },
  Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday: {
    cs: "Neděle_Pondělí_Úterý_Středa_Čtvrtek_Pátek_Sobota"
  },
  Monday_Tuesday_Wednesday_Thursday_Friday_Saturday_Sunday: {
    cs: "Pondělí_Úterý_Středa_Čtvrtek_Pátek_Sobota_Neděle"
  },
  Sun_Mon_Tue_Wed_Thu_Fri_Sat: {
    cs: "Ne_Po_Út_St_Čt_Pá_So"
  },
  Su_Mo_Tu_We_Th_Fr_Sa: {
    cs: "Ne_Po_Út_St_Čt_Pá_So"
  },
  "h:mm A": {
    cs: "H:mm"
  },
  "DD/MM/YYYY": {
    cs: "DD. MM. YYYY"
  },
  "DD ddd": {
    cs: "ddd DD."
  },
  "7": {
    cs: "1"
  },

  // calendar localization
  "All day": {
    cs: "Celý den"
  },
  Month: {
    cs: "Měsíc"
  },
  Week: {
    cs: "Týden"
  },
  Event: {
    cs: "Událost"
  },
  "Show more": {
    cs: "Více"
  },

  // alert messages
  "On this page you can view all upcoming massages. ": {
    cs: "Na této stránce můžete prohlížet nadcházející masáže. "
  },
  "To view details about or register a massage click on the appropriate event in the calendar below.": {
    cs: "Pro zobrazení detailů nebo pro zaregistrování masáže klikněte na odpovídající údálost v kalendáři níže."
  },
  "On this page you can view all your assigned massages. ": {
    cs: "Na této stránce můžete vidět své zapsané masáže. "
  },
  "To view massage details click on the event name.": {
    cs: "Pro zobrazení podrobností o masáži klikněte na název dané události."
  },
  "On this page you can manage your local user settings. ": {
    cs: "Na této stránce můžete spravovat svoje lokální uživatelské nastavení. "
  },
  "You can also use this page to access our repository on GitHub.": {
    cs: "Také lze tuto stránku použít k přístupu k našemu repozitáři na GitHubu."
  },
  "On this page you can manage facilities in which massages take place.": {
    cs: "Na této stránce můžete spravovat budovy, ve kterých se konají masáže."
  },
  "On this page you can view finished, archived massages.": {
    cs: "Na této stránce můžete prohlížet dokončené, archivované masáže."
  }
});

if (localStorage.getItem("sh-locale") === "en") {
  myLocalize.setLocale("en");
} else {
  myLocalize.setLocale("cs");
  localStorage.setItem("sh-locale", "cs");
}

export default myLocalize;
