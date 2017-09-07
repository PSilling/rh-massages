var Localize = require('localize');

const myLocalize = new Localize({
    // view names
    "Facilities": {
      "cs": "Budovy"
    },
    "Massages": {
      "cs": "Masáže"
    },
    "My Massages": {
      "cs": "Moje masáže"
    },
    "Profile": {
      "cs": "Profil"
    },

    // other titles
    "New Massage": {
      "cs": "Nová masáž"
    },
    "Edit Massage": {
      "cs": "Upravit masáž"
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

    // table items
    "Date": {
      "cs": "Datum"
    },
    "Masseuse": {
      "cs": "Masérka"
    },
    "Facility": {
      "cs": "Budova"
    },
    "Status": {
      "cs": "Status"
    },
    "Free": {
      "cs": "Volno"
    },
    "Full": {
      "cs": "Plno"
    },
    "Name": {
      "cs": "Jméno"
    },
    "Email": {
      "cs": "Email"
    },
    "Total massages": {
      "cs": "Počet masáží"
    },
    "No assigned massages": {
      "cs": "Žádné zapsané masáže"
    },

    // actions
    "Delete": {
      "cs": "Smazat"
    },
    "Edit": {
      "cs": "Upravit"
    },
    "Add": {
      "cs": "Přidat"
    },
    "Cancel": {
      "cs": "Zrušit"
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
    "Assign me": {
      "cs": "Zapsat se"
    },

    // notification messages
    "Your request has been successful.": {
      "cs": "Váš požadavek byl úspěšný."
    },
    "Your request has ended unsuccessfully.": {
      "cs": "Váš požadavek skončil neúspěšně."
    },
    "An error occured!": {
      "cs": "Nastala chyba!"
    },
    "page doesn't exist:": {
      "cs": "stránka neexistuje:"
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
    }
});

if (localStorage.getItem("sh-locale") === 'en') {
  myLocalize.setLocale("en");
} else {
  myLocalize.setLocale("cs");
  localStorage.setItem("sh-locale", "cs");
}

export default myLocalize;
