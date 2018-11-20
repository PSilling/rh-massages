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
  Schedule: {
    cs: "Rozpis"
  },

  // other titles
  "New Massage": {
    cs: "Nová masáž"
  },
  "Create Massages": {
    cs: "Vytvořit masáže"
  },
  "Create a new facility": {
    cs: "Vytvořit novou budovu"
  },
  "Create a new massage": {
    cs: "Vytvořit novou masáž"
  },
  "Edit Massage": {
    cs: "Upravit masáž"
  },
  "Edit Massages": {
    cs: "Upravit masáže"
  },
  "Copy Massages": {
    cs: "Zkopírovat masáže"
  },
  "New Facility": {
    cs: "Nová budova"
  },
  "Edit Facility": {
    cs: "Upravit budovu"
  },
  "Massage time": {
    cs: "Čas masáže"
  },
  Duration: {
    cs: "Délka trvání"
  },
  "Number of repetitions": {
    cs: "Počet opakování"
  },
  "Number of repetitions (weekly)": {
    cs: "Počet opakování (týdně)"
  },
  "Day step per repetition": {
    cs: "Denní skok na opakování"
  },
  Profile: {
    cs: "Profil"
  },
  Logout: {
    cs: "Odhlásit"
  },
  "Change language to czech": {
    cs: "Změnit jazyk na angličtinu"
  },
  "Show Keycloak profile": {
    cs: "Zobrazit Keycloak profil"
  },
  "Change masseur/masseuse": {
    cs: "Změnit maséra/masérku"
  },
  Later: {
    cs: "Později"
  },
  Earlier: {
    cs: "Dříve"
  },
  "Shift massage date (day and time)": {
    cs: "Posunout datum masáže (den a čas)"
  },
  "Day change": {
    cs: "Změna dne"
  },
  "Duration change": {
    cs: "Změna trvání"
  },
  Days: {
    cs: "Dny"
  },
  "Also remove all assigned clients": {
    cs: "Také odstranit všechny zapsané klienty"
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
  "Repeat each": {
    cs: "Opakovat v"
  },
  "Shift start": {
    cs: "Začátek směny"
  },
  Breaks: {
    cs: "Přestávky"
  },
  "Normal break": {
    cs: "Normální přestávka"
  },
  "Lunch break": {
    cs: "Obědová přestávka"
  },
  "Massages before lunch": {
    cs: "Masáží před obědem"
  },
  "Number of massages per day": {
    cs: "Počet masáží denně"
  },
  "Rule #": {
    cs: "Vzor #"
  },
  "Create rule": {
    cs: "Vytvořit vzor"
  },
  "Remove rule": {
    cs: "Odstranit vzor"
  },
  "Rule applies after": {
    cs: "Vzor platí od"
  },
  Import: {
    cs: "Importovat"
  },
  Export: {
    cs: "Exportovat"
  },
  More: {
    cs: "Více"
  },
  Less: {
    cs: "Méně"
  },
  "Show all": {
    cs: "Zobrazit vše"
  },
  "Collapse all": {
    cs: "Sbalit vše"
  },
  Details: {
    cs: "Podrobnosti"
  },
  Information: {
    cs: "Informace"
  },
  Editation: {
    cs: "Editace"
  },
  "User settings": {
    cs: "Uživatelská nastavení"
  },
  About: {
    cs: "O portálu"
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

  // table items
  Date: {
    cs: "Datum"
  },
  Time: {
    cs: "Čas"
  },
  "Masseur/Masseuse": {
    cs: "Masér/Masérka"
  },
  Facility: {
    cs: "Budova"
  },
  Status: {
    cs: "Status"
  },
  "Add to Google Calendar": {
    cs: "Přidat do Google kalendáře"
  },
  Free: {
    cs: "Volno"
  },
  Full: {
    cs: "Plno"
  },
  Name: {
    cs: "Název"
  },
  Unauthorized: {
    cs: "Neautorizováno"
  },
  Assigned: {
    cs: "Zapsáno"
  },
  "View as a table": {
    cs: "Zobrazit jako tabulku"
  },
  "View as panels": {
    cs: "Zobrazit jako panely"
  },
  "Just free": {
    cs: "Jen volné"
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
  "chosen month": {
    cs: "zvolený měsíc"
  },
  "custom:": {
    cs: "vlastní:"
  },

  // actions
  Delete: {
    cs: "Smazat"
  },
  "Delete all": {
    cs: "Smazat vše"
  },
  "Delete selected": {
    cs: "Smazat vybrané"
  },
  Edit: {
    cs: "Upravit"
  },
  "Edit selected": {
    cs: "Upravit vybrané"
  },
  Add: {
    cs: "Přidat"
  },
  Create: {
    cs: "Vytvořit"
  },
  "Add more": {
    cs: "Přidat další"
  },
  Copy: {
    cs: "Zkopírovat"
  },
  Cancel: {
    cs: "Zrušit"
  },
  "Force cancel": {
    cs: "Vynutit zrušení"
  },
  Dismiss: {
    cs: "Zrušit"
  },
  Close: {
    cs: "Zavřít"
  },
  Now: {
    cs: "Nyní"
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
  "Copy selected": {
    cs: "Kopírovat vybrané"
  },
  Print: {
    cs: "Vytisknout"
  },
  "Print settings": {
    cs: "Nastavení tisku"
  },
  "Reload page": {
    cs: "Načíst znovu"
  },

  // notification messages
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
  Warning: {
    cs: "Upozornění"
  },
  "Not all massages were edited as in some cases the new date would have been before now.": {
    cs: "Ne všechny masáže byly změněny, protože v některých případech by byl nový termín před nynějškem."
  },
  " (page doesn't exist): ": {
    cs: " (stránka neexistuje): "
  },
  "Back to main page": {
    cs: "Zpět na hlavní stránku"
  },
  None: {
    cs: "Žádné"
  },
  "Go to massages": {
    cs: "Jít na masáže"
  },
  "Name is required!": {
    cs: "Název je vyžadován!"
  },
  "Masseuse is required!": {
    cs: "Jméno masérky je vyžadováno!"
  },
  "At least one repeat day is required!": {
    cs: "Alespoň jeden opakovací den je vyžadován!"
  },
  Search: {
    cs: "Hledat"
  },
  Filtering: {
    cs: "Filtrování"
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
    cs: "Nadcházející"
  },
  Previous: {
    cs: "Předchozí"
  },
  "Later than next week": {
    cs: "Později než další týden"
  },
  "Later than next month": {
    cs: "Později než další měsíc"
  },
  Unassigned: {
    cs: "Nepřiřazeno"
  },
  "select events": {
    cs: "vybírat události"
  },
  "Legend:": {
    cs: "Legenda:"
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
  "Free massage": {
    cs: "Volná masáž"
  },
  "My massage": {
    cs: "Moje masáž"
  },
  "Assigned massage": {
    cs: "Přiřazená masáž"
  },
  "Masseuse, masseur or client name": {
    cs: "Jméno masérky, maséra anebo klienta"
  },

  // text messages
  "Action confirmation": {
    cs: "Potvrzení akce"
  },
  "Are you sure? This action cannot be reverted.": {
    cs: "Jste si jisti? Tato akce nemůže být navrácena."
  },
  "Are you sure you want to assign yourself to this massage?": {
    cs: "Jste si jisti, že se chcete zapsat na tuto masáž?"
  },
  "Are you sure you want to unassign yourself from this massage?": {
    cs: "Jste si jisti, že chcete se chcete odepsat z této masáže?"
  },
  "Are you sure you want to unassign a massage that is already assigned to someone else?": {
    cs: "Jste si jisti, že chcete odepsat masáž, kterou již má někdo další zapsanou?"
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
  "I want to recieve information about ": {
    cs: "Chci dostávat informace o "
  },
  "massage changes": {
    cs: "změnách masáží"
  },
  "Scheduling of new and cancellation of assigned massages": {
    cs: "Rozpis nových a zrušení připsaných masáží"
  },

  // tooltips
  "View per week": {
    cs: "Zobrazit po týdnech"
  },
  "View per month": {
    cs: "Zobrazit po měsících"
  },
  "How the facility should be called": {
    cs: "Jak by se tato budova měla jmenovat"
  },
  "The name of the masseur or massuese providing this massage": {
    cs: "Jméno maséra anebo masérky, který/á vykonává tuto masáž"
  },
  "How long should the massage be": {
    cs: "Jak dlouhá by měla masáž být"
  },
  "When should the massage be provided": {
    cs: "Kdy by se měla masáž konat"
  },
  "Create multiple massages at once": {
    cs: "Vytvořit více masáží najednou"
  },
  "Import previously downloaded rules": {
    cs: "Importovat dříve stažená pravidla"
  },
  "Download a configuration file that you can use to import these rules at a later date": {
    cs: "Stáhnout konfigurační soubor, který lze později použít pro importování těchto pravidel"
  },
  "Add a new creation macro": {
    cs: "Přidat nový vzor"
  },
  "Remove this creation macro": {
    cs: "Odstranit tento vzor"
  },
  "The date after which the defined massages should be created": {
    cs: "Datum, po kterém by se měly začít tvořit definované masáže"
  },
  "The number of weeks (after the start date) this rule should be applied to": {
    cs: "Počet týdnů (po startovním datu), po který by měl platit tento vzor"
  },
  "The name of the masseur or massuese providing this rule's massages": {
    cs: "Jméno maséra anebo masérky, který/á by měl/a vykonávat maséže tohoto vzoru"
  },
  "Information about the massages that should be created": {
    cs: "Informace o masážích, které sa mají vytvořit"
  },
  "The time after which massages will start to be created each day": {
    cs: "Čas, po kterém se každý den začnou vytvářet požadované masáže"
  },
  "How long should each of the created massages be": {
    cs: "Jak dlouho by měly vytvořené masáže trvat"
  },
  "How many massages should be created per day": {
    cs: "Kolik masáží by se mělo denně vytvořit"
  },
  "Information about breaks between individual massages": {
    cs: "Informace o přestávkách mezi jednotlivými masážemi"
  },
  "Length of the default break after each massage (not included the prelunch massage)": {
    cs: "Délka základní přestávky po každé masáži (mimo předobědovou)"
  },
  "Length of the lunch break": {
    cs: "Délka obědové přestávky"
  },
  "Number of massages before the lunch break": {
    cs: "Počet masáží před obědovou přestávkou"
  },
  "Unassign from this massage": {
    cs: "Odepsat se z této masáže"
  },
  "Show massage schedule print options": {
    cs: "Ukázat možnosti tisku rozpisu masáží"
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
  "Display only free (green) massages": {
    cs: "Zobrazit pouze volné (zelené) masáže"
  },
  "The days on which the defined massages should be created": {
    cs: "Dny, ve kterých by měly být požadované masáže vytvářeny"
  },
  "Masseuse, masseur or client name to use as a massages filter": {
    cs: "Masérka, masér anebo klient pro filtrování masáží"
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
    cs: "Pondělí_Úterý_Středu_Čtvrtek_Pátek_Sobotu_Neděli"
  },
  Sun_Mon_Tue_Wed_Thu_Fri_Sat: {
    cs: "Ne_Po_Út_St_Čt_Pá_So"
  },
  Su_Mo_Tu_We_Th_Fr_Sa: {
    cs: "Ne_Po_Út_St_Čt_Pá_So"
  },
  "hh:mm A": {
    cs: "HH:mm"
  },
  "DD/MM/YYYY": {
    cs: "DD. MM. YYYY"
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
    cs: "Zobrazit další"
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
